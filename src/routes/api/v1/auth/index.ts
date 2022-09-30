const bcrypt = require("bcryptjs");
import { FastifyPluginAsync } from "fastify";
import { responseData } from "@interfaces/response";

const auth: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    fastify.post(
        "/login",
        async (request: any, reply: any) => {
            try {
                const { User } = fastify.db.models;
                let cond = {
                    status: true,
                    is_deleted: false,
                    email: request.body.email,
                };
                const user = await User.findOne(cond);
                if (!user)
                    throw fastify.httpErrors.badRequest(
                        `User not found with email ${request.body.email}`
                    );

                const isPasswordCorrect = await bcrypt.compare(
                    request.body.password, user.password
                );
                if(!isPasswordCorrect)
                    throw fastify.httpErrors.badRequest(
                        `Please enter correct password`
                    );

                const token = await reply.jwtSign(
                    {
                        _id: user._id,
                        role: user.role,
                    },
                    { expiresIn: 60 * 60 }
                );
                //set auth token in redis
                await fastify.redis.set(
                    `${process.env.MS_NAME}:LoggedUsers:${user._id}`,
                    token
                );
                request.token = token;

                return fastify.sendResponse({
                    message: "Logged In Successfully",
                    data: {
                        auth: {
                            type: "Bearer",
                            token: request.token,
                            expiresIn: 60 * 60,
                        },
                    },
                } as responseData);
            } catch (err: any) {
                throw fastify.httpErrors.badRequest(
                    `Something went wrong: ${err.message ? err.message : err}`
                );
            }
        }
    );

    fastify.get(
        "/logout",
        {
            onRequest: [fastify.authVerify],
        },
        async (request: any, reply: any) => {
            try {
                //remove auth token in redis
                await fastify.redis.del(
                    `${process.env.MS_NAME}:LoggedUsers:${request.user._id}`
                );

                return fastify.sendResponse({
                    message: "Logged Out Successfully",
                    data: {
                        timestamp: Date.now(),
                    },
                } as responseData);
            } catch (err: any) {
                throw fastify.httpErrors.badRequest(
                    `Something went wrong: ${err.message ? err.message : err}`
                );
            }
        }
    );
};

export default auth;
