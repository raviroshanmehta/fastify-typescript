import { FastifyPluginAsync } from "fastify";

const index: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    fastify.get("/", async (request: any, reply: any) => {
        request.log.info("API's root location");
        return {
            root: true,
            msg: "Please append API verson in your URL to get access of docs. For example api/v1",
        };
    });
};

export default index;
