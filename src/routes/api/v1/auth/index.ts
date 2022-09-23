import { FastifyPluginAsync } from "fastify";
import { responseData } from "@interfaces/response";

const auth: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    fastify.post(
        "/login",
        {
            onRequest: [fastify.authLogin],
        },
        async (request: any, reply: any) => {
            try {
                return fastify.sendResponse({
                    message: "Logged In Successfully",
                    data: {
                        auth: {
                            type: "Bearer",
                            token: request.token,
                            expiresIn: 60 * 60
                        },
                    },
                } as responseData);
            } catch (err: any) {
                throw fastify.httpErrors.badRequest(
                    `Something went wrong: ${err.message}`
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
                await fastify.redis.del(`${process.env.MS_NAME}:LoggedUsers:${request.user._id}`);

                return fastify.sendResponse({
                    message: "Logged Out Successfully",
                    data: {
                        timestamp: Date.now()
                    },
                } as responseData);
            } catch (err: any) {
                throw fastify.httpErrors.badRequest(
                    `Something went wrong: ${err.message}`
                );
            }
        }
    );
};

export default auth;
