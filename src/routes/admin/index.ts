import { FastifyPluginAsync } from "fastify";

const index: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    fastify.get("/", async (request: any, reply: any) => {
        return reply.view("admin/index.ejs", {
            SITE_NAME: process.env.SITE_NAME,
            SITE_URL: process.env.SITE_URL,
        });
    });
};

export default index;
