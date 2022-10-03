import { FastifyPluginAsync } from "fastify";
import { responseData } from "@interfaces/response"; 
 
const index: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    

    await fastify.register(require("@fastify/swagger"), {
        routePrefix: "/docs",
        mode: "static",
        specification: {
            path: "src/swagger/v1.yaml",
        },
        exposeRoute: true,
    });

    fastify.get("/", async (request: any, reply: any) => {
        reply.redirect("/api/v1/docs");
    });

    fastify.get("/health-check", async (request: any, reply: any) => {
        try {
            return fastify.sendResponse({
                message: "The Application is Up and Running. API Version: V1",
                data: { },
            } as responseData);
        } catch (err: any) {
            throw fastify.httpErrors.badRequest(
                `Something went wrong: ${err.message ? err.message : err}`
            );
        }
    });
};

export default index;
