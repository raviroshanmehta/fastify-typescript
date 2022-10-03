import { FastifyInstance } from "fastify";
import { FastifyPluginAsync, FastifyPluginOptions } from "fastify";
import fp from "fastify-plugin";
import mongoose from "mongoose";
import { logger } from "../utilities/logger";

import { User, UserModel } from "../models/userModel";

export interface Models {
    User: UserModel;
}
export interface Db {
    models: Models;
}

// define options
export interface MyPluginOptions {}
const ConnectDB: FastifyPluginAsync<MyPluginOptions> = async (
    fastify: FastifyInstance,
    options: FastifyPluginOptions
) => {
    try {
        mongoose.connection.on("connected", () => {
            fastify.log.info("MongoDB connected");
        });
        mongoose.connection.on("disconnected", () => {
            fastify.log.error("MongoDB disconnected");
        });
        await mongoose.connect(process.env.MONGO_URI as string, {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
            // useCreateIndex: true,
        });
        mongoose.set("debug", process.env.NODE !== "production");

        const models: Models = { User };

        fastify.decorate("db", { models });
    } catch (error: any) {
        logger.error(`${error}`);
        fastify.log.error(error);
    }
};
export default fp(ConnectDB);

// Declaration merging
declare module "fastify" {
    export interface FastifyInstance {
        db: Db;
    }
}
