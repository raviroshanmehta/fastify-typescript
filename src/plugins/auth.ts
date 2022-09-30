import fp from "fastify-plugin";
import fastifyJwt from "@fastify/jwt";

export interface AuthPluginOptions {
    // Specify Auth plugin options here
}

// The use of fastify-plugin is required to be able
// to export the decorators to the outer scope
export default fp<AuthPluginOptions>(async (fastify, opts) => {
    fastify.register(fastifyJwt, {
        secret: process.env.JWT_SECERET as string,
    });
    
    fastify.decorate("authVerify", async function (request: any, reply: any) {
        try {
            let user = await request.jwtVerify();
            //get auth token from redis
            let token = await fastify.redis.get(
                `${process.env.MS_NAME}:LoggedUsers:${user._id}`
            );
            if (!token) throw fastify.httpErrors.badRequest(`Auth Token is expired. Please login back to continue`);
            
        } catch (err: any) {
            throw fastify.httpErrors.unauthorized(
                `Authorization Error: ${err.message}`
            );
        }
    });
});

// When using .decorate you have to specify added properties for Typescript
declare module "fastify" {
    export interface FastifyInstance {
        authVerify(): string;
    }
}
