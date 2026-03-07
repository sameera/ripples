import {
    DynamoDBClient,
    CreateTableCommand,
    ResourceInUseException,
} from "@aws-sdk/client-dynamodb";

const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME ?? "ripples";

const client = new DynamoDBClient({
    region: process.env.AWS_REGION ?? "us-east-1",
    ...(process.env.DYNAMODB_ENDPOINT
        ? { endpoint: process.env.DYNAMODB_ENDPOINT }
        : {}),
});

async function bootstrap(): Promise<void> {
    console.log(`Bootstrapping DynamoDB table: ${TABLE_NAME}`);
    if (process.env.DYNAMODB_ENDPOINT) {
        console.log(`  Endpoint: ${process.env.DYNAMODB_ENDPOINT}`);
    }

    try {
        await client.send(
            new CreateTableCommand({
                TableName: TABLE_NAME,
                BillingMode: "PAY_PER_REQUEST",
                AttributeDefinitions: [
                    { AttributeName: "PK", AttributeType: "S" },
                    { AttributeName: "SK", AttributeType: "S" },
                    { AttributeName: "GSI1PK", AttributeType: "S" },
                    { AttributeName: "GSI1SK", AttributeType: "S" },
                    { AttributeName: "GSI2PK", AttributeType: "S" },
                    { AttributeName: "GSI2SK", AttributeType: "S" },
                    { AttributeName: "GSI3PK", AttributeType: "S" },
                    { AttributeName: "GSI3SK", AttributeType: "S" },
                ],
                KeySchema: [
                    { AttributeName: "PK", KeyType: "HASH" },
                    { AttributeName: "SK", KeyType: "RANGE" },
                ],
                GlobalSecondaryIndexes: [
                    {
                        // Hierarchical parent → child queries:
                        // org→users, org→teams, team→streams, user→teams,
                        // stream→sprints, item→streams, item→sprints
                        IndexName: "GSI1",
                        KeySchema: [
                            { AttributeName: "GSI1PK", KeyType: "HASH" },
                            { AttributeName: "GSI1SK", KeyType: "RANGE" },
                        ],
                        Projection: { ProjectionType: "ALL" },
                    },
                    {
                        // User Ripple timeline: all Ripples by a user, sorted by day
                        IndexName: "GSI2",
                        KeySchema: [
                            { AttributeName: "GSI2PK", KeyType: "HASH" },
                            { AttributeName: "GSI2SK", KeyType: "RANGE" },
                        ],
                        Projection: { ProjectionType: "ALL" },
                    },
                    {
                        // Sparse index: Team Leader approval queue.
                        // Only populated on pending retroactive Ripples.
                        IndexName: "GSI3",
                        KeySchema: [
                            { AttributeName: "GSI3PK", KeyType: "HASH" },
                            { AttributeName: "GSI3SK", KeyType: "RANGE" },
                        ],
                        Projection: { ProjectionType: "ALL" },
                    },
                ],
                StreamSpecification: {
                    StreamEnabled: false,
                },
            }),
        );
        console.log(`Table "${TABLE_NAME}" created successfully.`);
    } catch (e) {
        if (e instanceof ResourceInUseException) {
            console.log(`Table "${TABLE_NAME}" already exists — skipping.`);
        } else {
            throw e;
        }
    }
}

bootstrap().catch((err: unknown) => {
    console.error("Bootstrap failed:", err);
    process.exit(1);
});
