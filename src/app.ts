import AutoLoad, { AutoloadPluginOptions } from "@fastify/autoload";
import { FastifyPluginAsync } from "fastify";

import { join } from "path";
import fastifyRedis from "@fastify/redis";
import fastifyStatic from "@fastify/static";
import fastifyEtag from "@fastify/etag";
import fastifyHelmet from "@fastify/helmet";
import pointOfView from "@fastify/view";
import fastifyCors from "@fastify/cors";

import { redisDb } from "@interfaces/dbConnections";

export type AppOptions = {
    // Place your custom options for app below here.
} & Partial<AutoloadPluginOptions>;

const app: FastifyPluginAsync<AppOptions> = async (
    fastify,
    opts
): Promise<void> => {
    try {
        //redis connection
        await fastify.register(fastifyRedis, {
            host: process.env.REDIS_HOST,
            password: process.env.REDIS_PASSWORD,
            port: process.env.REDIS_PORT as unknown as number,
            family: process.env.REDIS_FAMILY as unknown as number,
        } as redisDb);
        //set server started time in redis
        await fastify.redis.set(
            `${process.env.MS_NAME}:server_up_timestamp`,
            Date.now()
        );
       
        fastify.register(fastifyStatic, {
            root: join(__dirname, "public"),
            prefix: "/",
        });
        fastify.register(fastifyEtag);
        fastify.register(fastifyHelmet, {
            crossOriginEmbedderPolicy: false,
        });
        fastify.register(fastifyCors, (instance) => {
            return (req: any, callback: any) => {
                const corsOptions = {
                    origin: true,
                };
                if (/^process.env.CORS_ENABLED$/m.test(req.headers.origin)) {
                    corsOptions.origin = false;
                }
                callback(null, corsOptions);
            };
        });
        fastify.register(pointOfView, {
            engine: {
                ejs: require("ejs"),
            },
            root: join(__dirname, "views"),
        });

        // Do not touch the following lines

        // This loads all plugins defined in plugins
        // those should be support plugins that are reused
        // through your application
        void fastify.register(AutoLoad, {
            dir: join(__dirname, "plugins"),
            options: opts,
        });

        // This loads all plugins defined in routes
        // define your routes in one of these
        void fastify.register(AutoLoad, {
            dir: join(__dirname, "routes"),
            options: opts,
        });
    } catch (err) {
        console.log("App crashed", err);
    }
};

export default app;
export { app };
