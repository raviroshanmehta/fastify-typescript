import fp from "fastify-plugin";
export interface UtilsPluginOptions {
    // Specify Utils plugin options here
}

// The use of fastify-plugin is required to be able
// to export the decorators to the outer scope
export default fp<UtilsPluginOptions>(async (fastify, opts) => {
    fastify.decorate(
        "sendResponse",
        async function (input: any, request: any, reply: any) {
            try {
                return {
                    message: input.message ? input.message : "Success",
                    data: input.data ? input.data : {},
                };
            } catch (err: any) {
                throw fastify.httpErrors.badRequest(
                    `Something went wrong: ${err.message ? err.message : err}`
                );
            }
        }
    );

    fastify.decorate(
        "saveLocales",
        async function (request: any, reply: any) {
            try {
                fastify.log.info("SaveLocales called");
            } catch (err: any) {
                throw fastify.httpErrors.badRequest(
                    `Something went wrong: ${err.message ? err.message : err}`
                );
            }
        }
    );
});

// When using .decorate you have to specify added properties for Typescript
declare module "fastify" {
    export interface FastifyInstance {
        sendResponse(data: any): string;
        saveLocales(): string;
    }
}
