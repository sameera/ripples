import { TransactionCanceledException } from "@aws-sdk/client-dynamodb";
import { GetCommand, TransactWriteCommand } from "@aws-sdk/lib-dynamodb";
import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { ulid } from "ulid";

const TABLE = process.env.DYNAMODB_TABLE_NAME ?? "ripples";

const orgState = { id: "" };

declare module "fastify" {
    interface FastifyInstance {
        org: { id: string };
    }
}

export default fp(async function orgPlugin(fastify: FastifyInstance) {
    fastify.decorate("org", orgState);

    fastify.addHook("onReady", async function () {
        const existing = await fastify.db.send(
            new GetCommand({
                TableName: TABLE,
                Key: { PK: "APP#CONFIG", SK: "ORG" },
            }),
        );

        if (existing.Item) {
            orgState.id = existing.Item["orgId"] as string;
            fastify.log.info({ orgId: orgState.id }, "Organization loaded.");
            return;
        }

        const orgName = process.env.ORG_NAME;
        if (!orgName) {
            throw new Error(
                "ORG_NAME environment variable is required. " +
                    "Set it in your .env file and restart the server.",
            );
        }

        const orgId = ulid();
        const now = new Date().toISOString();

        try {
            await fastify.db.send(
                new TransactWriteCommand({
                    TransactItems: [
                        {
                            Put: {
                                TableName: TABLE,
                                Item: {
                                    PK: "APP#CONFIG",
                                    SK: "ORG",
                                    orgId,
                                    createdAt: now,
                                },
                                ConditionExpression: "attribute_not_exists(PK)",
                            },
                        },
                        {
                            Put: {
                                TableName: TABLE,
                                Item: {
                                    PK: `ORG#${orgId}`,
                                    SK: "METADATA",
                                    type: "ORGANIZATION",
                                    orgId,
                                    name: orgName,
                                    timezone: process.env.ORG_TIMEZONE ?? "UTC",
                                    createdAt: now,
                                    planTier: "free",
                                },
                                ConditionExpression: "attribute_not_exists(PK)",
                            },
                        },
                    ],
                }),
            );

            orgState.id = orgId;
            fastify.log.info({ orgId }, `Organization seeded: "${orgName}"`);
        } catch (err: unknown) {
            if (err instanceof TransactionCanceledException) {
                // Another process seeded concurrently — fetch the existing record.
                const retry = await fastify.db.send(
                    new GetCommand({
                        TableName: TABLE,
                        Key: { PK: "APP#CONFIG", SK: "ORG" },
                    }),
                );
                orgState.id = retry.Item!["orgId"] as string;
                fastify.log.info({ orgId: orgState.id }, "Organization already seeded.");
            } else {
                throw err;
            }
        }
    });
});
