import { FastifyPluginAsync, FastifyRequest, FastifyReply } from "fastify";
import { responseData } from "@interfaces/response"; 

const index: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    fastify.get("/", async (request: any, reply: any) => {
        return {
            root: true,
            msg: "Please append API verson in your URL to get access of docs. For example api/v1",
        };
    });

    fastify.get("/seed", async (req: FastifyRequest, reply: FastifyReply) => {
        try {
            const { User } = fastify.db.models;

            const adminData = {
                name: "Super Admin",
                email: "superadmin@mail.com",
                mobile: "9990009990",
                role: "admin",
                password: "password",
            };

            await User.findOneAndDelete({ email: adminData.email });

            const admin = User.addOne(adminData);
            await admin.save();

            return fastify.sendResponse({
                message: "Entry added successfully.",
                data: { admin: adminData },
            } as responseData);
        } catch (err: any) {
            throw fastify.httpErrors.badRequest(
                `Something went wrong during default seeding: ${
                    err.message ? err.message : err
                }`
            );
        }
    });
};

export default index;
