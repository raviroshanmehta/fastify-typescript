import { FastifyPluginAsync, FastifyRequest, FastifyReply } from "fastify";
import { responseData } from "@interfaces/response";

import { InterfaceUser } from "@interfaces/users";

const users: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    const { User } = fastify.db.models;

    fastify.get(
        "/",
        {
            onRequest: [fastify.authVerify],
        },
        async (
            req: FastifyRequest,
            reply: FastifyReply
        ) => {
            try {
                let cond = {
                    status: true,
                    is_deleted: false,
                    role: "user",
                };

                const users = await User.find(cond);
                return fastify.sendResponse({
                    message: "Feteched successfully",
                    data: {
                        users,
                    },
                } as responseData);

            } catch (err: any) {
                throw fastify.httpErrors.badRequest(err);
            }
        }
    );

    fastify.post(
        "/",
        {
            onRequest: [fastify.authVerify],
        },
        async (
            req: FastifyRequest<{ Body: InterfaceUser }>,
            reply: FastifyReply
        ) => {
            try {
                const user = User.addOne(req.body);
                await user.save();

                return fastify.sendResponse({
                    message: fastify.locales(
                        req.headers["lang"] as string,
                        "CREATE_SUCCESS"
                    ),
                    data: {
                        user,
                    },
                } as responseData);

            } catch (err: any) {
                throw fastify.httpErrors.badRequest(err);
            }
        }
    );

    fastify.get(
        "/:id",
        {
            onRequest: [fastify.authVerify],
        },
        async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
            try {
                let cond = {
                    status: true,
                    is_deleted: false,
                    _id: req.params.id,
                };

                const user = await User.findOne(cond);
                if (!user) {
                    throw fastify.httpErrors.notFound(
                        fastify.locales(
                            req.headers["lang"] as string,
                            "NOT_FOUND"
                        )
                    );
                }

                return fastify.sendResponse({
                    message: fastify.locales(
                        req.headers["lang"] as string,
                        "READ_SUCCESS"
                    ),
                    data: {
                        user,
                    },
                } as responseData);

            } catch (err: any) {
                throw fastify.httpErrors.badRequest(err);
            }
        }
    );

    fastify.put(
        "/:id",
        {
            onRequest: [fastify.authVerify],
        },
        async (
            req: FastifyRequest<{ Params: { id: string }, Body: InterfaceUser }>,
            reply: FastifyReply
        ) => {
            try {
                let cond = {
                    status: true,
                    is_deleted: false,
                    _id: req.params.id,
                };

                const user = await User.findOneAndUpdate(cond, req.body, {
                    new: true,
                });
                if (!user) {
                    throw fastify.httpErrors.notFound(
                        fastify.locales(
                            req.headers["lang"] as string,
                            "NOT_FOUND"
                        )
                    );
                }

                return fastify.sendResponse({
                    message: fastify.locales(
                        req.headers["lang"] as string,
                        "UPDATE_SUCECSS"
                    ),
                    data: {
                        user,
                    },
                } as responseData);

            } catch (err: any) {
                throw fastify.httpErrors.badRequest(err);
            }
        }
    );

    fastify.delete(
        "/:id",
        {
            onRequest: [fastify.authVerify],
        },
        async (req: FastifyRequest<{ Params: { id: string } }>, reply: any) => {
            try {
                let cond = {
                    status: true,
                    is_deleted: false,
                    _id: req.params.id,
                };

                const user = await User.findOne(cond);
                if (!user) {
                    throw fastify.httpErrors.notFound(
                        fastify.locales(
                            req.headers["lang"] as string,
                            "NOT_FOUND"
                        )
                    );
                }

                await User.findOneAndUpdate(cond, {
                    email: user.email + "_DELETED_" + Date.now(),
                    mobile: user.mobile + "_DELETED_" + Date.now(),
                    is_deleted: true,
                });

                return fastify.sendResponse({
                    message: fastify.locales(
                        req.headers["lang"] as string,
                        "DELETE_SUCCESS"
                    ),
                    data: {
                        user,
                    },
                } as responseData);
                
            } catch (err: any) {
                throw fastify.httpErrors.badRequest(err);
            }
        }
    );
};

export default users;
