const bcrypt = require("bcryptjs");
import { FastifyPluginAsync, FastifyRequest, FastifyReply } from "fastify";
import { responseData } from "@interfaces/response";
import { InterfaceIsUnique, InterfaceLogin } from "@interfaces/auth";

const auth: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    const { User } = fastify.db.models;
    
    fastify.get(
        "/is-unique",
        async (
            req: FastifyRequest<{
                Querystring: InterfaceIsUnique;
            }>,
            reply: FastifyReply
        ) => {
            try {
                let cond = { is_deleted: false };
                const { type, value } = req.query;

                switch (type) {
                    case "email":
                        Object.assign(cond, { email: value });
                        break;
                    case "mobile":
                        Object.assign(cond, { mobile: value });
                        break;
                    default:
                        break;
                }

                const user = await User.findOne(cond);

                if (!user)
                    return fastify.sendResponse({
                        message: fastify.locales(
                            req.headers["lang"] as string,
                            "UNIQUE"
                        ),
                        data: { type, value },
                    } as responseData);

                if (user && user.status === false)
                    throw fastify.httpErrors.notFound(
                        fastify.locales(
                            req.headers["lang"] as string,
                            "NOT_UNIQUE"
                        )
                    );
               
                throw fastify.httpErrors.notFound(
                    fastify.locales(req.headers["lang"] as string, "NOT_UNIQUE")
                );

            } catch (err: any) {
                throw fastify.httpErrors.badRequest(err);
            }
        }
    );

    fastify.post(
        "/login",
        async (
            req: FastifyRequest<{ Body: InterfaceLogin }>,
            reply: FastifyReply
        ) => {
            try {
                const { email, password, role } = req.body;

                let cond = {
                    status: true,
                    is_deleted: false,
                    email: email,
                    role: role
                };
                const user = await User.findOne(cond);
                if (!user)
                    throw fastify.httpErrors.badRequest(
                        fastify.locales(
                            req.headers["lang"] as string,
                            "NOT_FOUND"
                        )
                    );

                const isPasswordCorrect = await bcrypt.compare(
                    password,
                    user.password
                );
                if (!isPasswordCorrect)
                    throw fastify.httpErrors.badRequest(
                        fastify.locales(req.headers["lang"] as string, "PASSWORD_WRONG")
                    );

                const token = await reply.jwtSign(
                    {
                        _id: user._id,
                        role: user.role,
                    },
                    { expiresIn: 60 * 60 }
                );
                //set auth token in redis
                await fastify.redis.set(
                    `${process.env.MS_NAME}:LoggedUsers:${user._id}`,
                    token
                );
                // request.token = token;

                return fastify.sendResponse({
                    message: fastify.locales(req.headers["lang"] as string,"LOGIN_SUCCESS"),
                    data: {
                        auth: {
                            type: "Bearer",
                            token: token,
                            expiresIn: 60 * 60,
                        },
                    },
                } as responseData);
            } catch (err: any) {
                throw fastify.httpErrors.badRequest(err);
            }
        }
    );

    fastify.get(
        "/logout",
        {
            onRequest: [fastify.authVerify],
        },
        async (req: any, reply: FastifyReply) => {
            try {
                //remove auth token in redis
                await fastify.redis.del(
                    `${process.env.MS_NAME}:LoggedUsers:${req.user._id}`
                );

                return fastify.sendResponse({
                    message: fastify.locales(
                        req.headers["lang"] as string,
                        "LOGOUT_SUCCESS"
                    ),
                    data: {
                        timestamp: Date.now(),
                    },
                } as responseData);
            } catch (err: any) {
                throw fastify.httpErrors.badRequest(err);
            }
        }
    );
};

export default auth;
