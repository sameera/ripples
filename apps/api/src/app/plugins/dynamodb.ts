import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";

declare module "fastify" {
    interface FastifyInstance {
        db: DynamoDBDocumentClient;
    }
}

export default fp(async function dynamodbPlugin(fastify: FastifyInstance) {
    const client = new DynamoDBClient({
        region: process.env.AWS_REGION ?? "us-east-1",
        ...(process.env.DYNAMODB_ENDPOINT
            ? { endpoint: process.env.DYNAMODB_ENDPOINT }
            : {}),
    });

    const db = DynamoDBDocumentClient.from(client, {
        marshallOptions: { removeUndefinedValues: true },
    });

    fastify.decorate("db", db);

    fastify.addHook("onClose", async () => {
        client.destroy();
    });
});
