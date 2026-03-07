import { TransactionCanceledException } from "@aws-sdk/client-dynamodb";
import { GetCommand, QueryCommand, TransactWriteCommand } from "@aws-sdk/lib-dynamodb";
import { CognitoJwtVerifier } from "aws-jwt-verify";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin";

const TABLE = process.env.DYNAMODB_TABLE_NAME ?? "ripples";

interface UserPayload {
    sub: string;
    email: string;
    name?: string;
}

declare module "fastify" {
    interface FastifyRequest {
        user: UserPayload;
    }
    interface FastifyInstance {
        authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
        ensureUser: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    }
}

export default fp(async function authPlugin(fastify: FastifyInstance) {
    const userPoolId = process.env.COGNITO_USER_POOL_ID;
    const clientId = process.env.COGNITO_CLIENT_ID;

    if (!userPoolId || !clientId) {
        throw new Error(
            "COGNITO_USER_POOL_ID and COGNITO_CLIENT_ID environment variables are required.",
        );
    }

    const verifier = CognitoJwtVerifier.create({
        userPoolId,
        clientId,
        tokenUse: "id",
    });

    async function authenticate(
        request: FastifyRequest,
        reply: FastifyReply,
    ): Promise<void> {
        const authHeader = request.headers.authorization;
        if (!authHeader?.startsWith("Bearer ")) {
            return reply.code(401).send({ error: "Unauthorized" });
        }

        try {
            const payload = await verifier.verify(authHeader.slice(7));
            request.user = {
                sub: payload.sub,
                email: (payload["email"] as string) ?? "",
                name: payload["name"] as string | undefined,
            };
        } catch {
            return reply.code(401).send({ error: "Unauthorized" });
        }
    }

    async function ensureUser(
        request: FastifyRequest,
        reply: FastifyReply,
    ): Promise<void> {
        const { sub, email, name } = request.user;
        const userPk = `USER#${email}`;

        const existing = await fastify.db.send(
            new GetCommand({
                TableName: TABLE,
                Key: { PK: userPk, SK: "METADATA" },
            }),
        );

        if (existing.Item) {
            return;
        }

        const orgUsers = await fastify.db.send(
            new QueryCommand({
                TableName: TABLE,
                IndexName: "GSI1",
                KeyConditionExpression:
                    "GSI1PK = :orgPk AND begins_with(GSI1SK, :prefix)",
                ExpressionAttributeValues: {
                    ":orgPk": `ORG#${fastify.org.id}`,
                    ":prefix": "USER#",
                },
                Select: "COUNT",
                Limit: 1,
            }),
        );

        const role = (orgUsers.Count ?? 0) === 0 ? "admin" : "member";
        const now = new Date().toISOString();

        try {
            await fastify.db.send(
                new TransactWriteCommand({
                    TransactItems: [
                        {
                            Put: {
                                TableName: TABLE,
                                Item: {
                                    PK: userPk,
                                    SK: "METADATA",
                                    type: "USER",
                                    userId: email,
                                    cognitoSub: sub,
                                    orgId: fastify.org.id,
                                    name: name ?? email,
                                    email,
                                    role,
                                    createdAt: now,
                                    GSI1PK: `ORG#${fastify.org.id}`,
                                    GSI1SK: `USER#${email}`,
                                },
                                ConditionExpression: "attribute_not_exists(PK)",
                            },
                        },
                        {
                            Put: {
                                TableName: TABLE,
                                Item: {
                                    PK: `COGNITO#${sub}`,
                                    SK: "METADATA",
                                    type: "COGNITO_USER",
                                    cognitoSub: sub,
                                    email,
                                },
                                ConditionExpression: "attribute_not_exists(PK)",
                            },
                        },
                    ],
                }),
            );
        } catch (err: unknown) {
            if (!(err instanceof TransactionCanceledException)) {
                throw err;
            }
            // Race condition: another request provisioned this user concurrently. Safe to continue.
        }
    }

    fastify.decorate("authenticate", authenticate);
    fastify.decorate("ensureUser", ensureUser);
});
