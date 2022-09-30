import { FastifyPluginAsync } from "fastify";
import { responseData } from "@interfaces/response";

const users: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    const { User } = fastify.db.models;

    fastify.get(
        "/",
        {
            onRequest: [fastify.authVerify],
        },
        async (request: any, reply: any) => {
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
                throw fastify.httpErrors.badRequest(
                    `Something went wrong: ${err.message ? err.message : err}`
                );
            }
        }
    );

    fastify.post(
        "/",
        {
            onRequest: [fastify.authVerify],
        },
        async (request: any, reply: any) => {
            try {
                const user = User.addOne(request.body);
                await user.save();

                return fastify.sendResponse({
                    message: "Added successfully",
                    data: {
                        user,
                    },
                } as responseData);
            } catch (err: any) {
                throw fastify.httpErrors.badRequest(
                    `Something went wrong: ${err.message ? err.message : err}`
                );
            }
        }
    );

    fastify.get(
        "/:id",
        {
            onRequest: [fastify.authVerify],
        },
        async (request: any, reply: any) => {
            try {
                let cond = {
                    status: true,
                    is_deleted: false,
                    _id: request.params.id,
                };

                const user = await User.findOne(cond);
                if (!user) {
                    throw fastify.httpErrors.notFound(
                        `User not found with id ${request.params.id}`
                    );
                }

                return fastify.sendResponse({
                    message: "Feteched successfully",
                    data: {
                        user,
                    },
                } as responseData);
            } catch (err: any) {
                throw fastify.httpErrors.badRequest(
                    `Something went wrong: ${err.message ? err.message : err}`
                );
            }
        }
    );

    fastify.put(
        "/:id",
        {
            onRequest: [fastify.authVerify],
        },
        async (request: any, reply: any) => {
            try {
                let cond = {
                    status: true,
                    is_deleted: false,
                    _id: request.params.id,
                };

                const user = await User.findOneAndUpdate(cond, request.body, {
                    new: true,
                });
                if (!user) {
                    throw fastify.httpErrors.notFound(
                        `User not found with id ${request.params.id}`
                    );
                }

                return fastify.sendResponse({
                    message: "Updated successfully",
                    data: {
                        user,
                    },
                } as responseData);
            } catch (err: any) {
                throw fastify.httpErrors.badRequest(
                    `Something went wrong: ${err.message ? err.message : err}`
                );
            }
        }
    );

    fastify.delete(
        "/:id",
        {
            onRequest: [fastify.authVerify],
        },
        async (request: any, reply: any) => {
            try {
                let cond = {
                    status: true,
                    is_deleted: false,
                    _id: request.params.id,
                };

                const user = await User.findOne(cond);
                if (!user) {
                    throw fastify.httpErrors.notFound(
                        `User not found with id ${request.params.id}`
                    );
                }

                await User.findOneAndUpdate(cond, {
                    email: user.email + "_DELETED_" + Date.now(),
                    mobile: user.mobile + "_DELETED_" + Date.now(),
                    is_deleted: true,
                });

                return fastify.sendResponse({
                    message: "Deleted successfully",
                    data: {
                        user,
                    },
                } as responseData);
            } catch (err: any) {
                throw fastify.httpErrors.badRequest(
                    `Something went wrong: ${err.message ? err.message : err}`
                );
            }
        }
    );
};

export default users;
