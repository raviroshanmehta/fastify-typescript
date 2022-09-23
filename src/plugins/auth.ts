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

    fastify.decorate("authLogin", async function (request: any, reply: any) {
        try {
            //db query fetch
            const user = { 
                name: "Ravi Roshan",
                _id : "1",
                role: "user"
            }
            if(!user)
                throw fastify.httpErrors.badRequest(`No data`);

            const token = await reply.jwtSign(
                {
                    _id: user._id,
                    role: user.role
                },
                { expiresIn: 60 * 60 }
            );
            //set auth token in redis
            await fastify.redis.set(`${process.env.MS_NAME}:LoggedUsers:${user._id}`,token);

            request.token = token;
            return;
        } catch (err: any) {
            throw fastify.httpErrors.badRequest(`Login Error: ${err.message}`);
        }
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
        authLogin(): string;
        authVerify(): string;
    }
}
