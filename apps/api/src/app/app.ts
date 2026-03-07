import * as path from "path";
import { FastifyInstance } from "fastify";
import AutoLoad from "@fastify/autoload";
import sensiblePlugin from "./plugins/sensible";
import dynamodbPlugin from "./plugins/dynamodb";
import orgPlugin from "./plugins/org";
import authPlugin from "./plugins/auth";

export interface AppOptions {}

export async function app(fastify: FastifyInstance, opts: AppOptions) {
    // Infrastructure plugins — registered in dependency order.
    // sensible must come first (HTTP utilities used by all plugins).
    // dynamodb before org (org reads/writes DynamoDB).
    // org before auth (auth needs fastify.org.id for user seeding).
    fastify.register(sensiblePlugin);
    fastify.register(dynamodbPlugin);
    fastify.register(orgPlugin);
    fastify.register(authPlugin);

    // Route handlers — order does not matter.
    fastify.register(AutoLoad, {
        dir: path.join(__dirname, "routes"),
        options: { ...opts },
    });
}
