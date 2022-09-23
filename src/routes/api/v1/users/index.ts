import { FastifyPluginAsync } from "fastify";
import { responseData } from "@interfaces/response";

const users: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    fastify.get(
        "/",
        {
            onRequest: [fastify.authVerify],
        },
        async (request: any, reply: any) => {
            try {
                
                return fastify.sendResponse({
                    message: "Feteched successfully",
                    data: {
                        user: request.user,
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

export default users;
