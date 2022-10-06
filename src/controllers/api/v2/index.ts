import { FastifyPluginAsync, FastifyRequest, FastifyReply } from "fastify";
import { responseData } from "@interfaces/response";

const index: FastifyPluginAsync = async (fastify, opts): Promise<void> => {

    await fastify.register(require("@fastify/swagger"), {
        routePrefix: "/docs",
        mode: "static",
        specification: {
            path: "src/swagger/v2.yaml",
        },
        exposeRoute: true,
    });

    fastify.get("/", async (req: FastifyRequest, reply: FastifyReply) => {
        reply.redirect("/api/v2/docs");
    });

    fastify.get(
        "/health-check",
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                // return reply.send(
                //     await fastify.sendResponse({
                //         message:
                //             "The Application is Up and Running. API Version: V1",
                //         data: {},
                //     } as responseData)
                // );
                return fastify.sendResponse({
                    message:
                        fastify.locales(
                            req.headers["lang"] as string,
                            "HEALTH_CHECK"
                        ) + " API:V2",
                    data: {
                        last_up_time: new Date(
                            parseInt(
                                (await fastify.redis.get(
                                    `${process.env.MS_NAME}:server_up_timestamp`
                                )) as string
                            )
                        ),
                    },
                } as responseData);
            } catch (err: any) {
                throw fastify.httpErrors.badRequest(err);
            }
        }
    );
};

export default index;
