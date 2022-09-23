import { FastifyPluginAsync } from "fastify";

const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    // fastify.get("/", async function (request, reply) {
    //     return { root: true };
    // });
    fastify.get("/", async (request: any, reply: any) => {
        return reply.view("index.ejs", {
            SITE_NAME: process.env.SITE_NAME,
            SITE_URL: process.env.SITE_URL,
        });
    });
};

export default root;
