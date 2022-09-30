import { Schema, Document, model, Model } from "mongoose";
const bcrypt = require("bcryptjs");

export interface UserAttrs {
    name: string;
    email: string;
    mobile: string;
    role?: string;
    password: string;
    device?: object;
}

export interface UserModel extends Model<UserDocument> {
    addOne(doc: UserAttrs): UserDocument;
}

export interface UserDocument extends Document {
    name: string;
    email: string;
    mobile: string;
    role: string;
    password: string;
    device: object;
    createdAt: string;
    updatedAt: string;
}
export const UserSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        mobile: {
            type: String,
            required: true,
            unique: true,
        },
        role: {
            type: String,
            enum: ["superadmin", "admin", "user"],
            default: "user",
        },
        password: {
            type: String,
            required: true,
        },
        status: {
            type: Boolean,
            default: true,
        },
        is_deleted: {
            type: Boolean,
            default: false,
        },
        device: {
            id: String,
            os: {
                type: String,
                enum: ["web", "android", "ios"],
                default: "web",
            },
            version: String,
            firebase_token: String,
        },
    },
    {
        timestamps: true,
    }
);

UserSchema.statics.addOne = (doc: UserAttrs) => {
    return new User(doc);
};

UserSchema.pre("save", async function (next) {
    if (this.password && this.isModified('password') ) {
        const salt = await bcrypt.genSaltSync(10);
        const hash = await bcrypt.hashSync(this.password, salt);
        this.password = hash;
    }
    next();
});

UserSchema.pre("findOneAndUpdate", async function (next) {
    const docToUpdate = await this.model.findOne(this.getQuery());
    if (docToUpdate.password && docToUpdate.isModified("password")) {
        const salt = await bcrypt.genSaltSync(10);
        const hash = await bcrypt.hashSync(docToUpdate.password, salt);
        docToUpdate.password = hash;
    }
    next();
});

export const User = model<UserDocument, UserModel>("User", UserSchema);
