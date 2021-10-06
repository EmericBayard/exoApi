import mongoose from "mongoose";
import bcrypt from "bcrypt";
import config from "config";
import log from "../helpers/logger";

export interface UserDocument extends mongoose.Document {
    email: string;
    name: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new mongoose.Schema(
    {
        email: { type: String, required: true, unique: true },
        name: { type: String, require: true},
        password: { type: String, required: true},

    },
    { timestamps: true}
);

UserSchema.methods.comparePassword = async function (

    candidatePassword: string
) {
    const user = this as UserDocument;
    try {
        return bcrypt.compare(candidatePassword, user.password);
    } catch(e) {
        return false;
    }
}

UserSchema.pre("save", async function () {
    let user = this as UserDocument;

    //only hash the pwd if it has been modified (or is new)
    if (user.isModified("password")) {

        const salt = await bcrypt.genSalt(config.get("saltWorkFactor"));

        const hash = await bcrypt.hashSync(user.password, salt);

        //Replace the pwd with the hash

        user.password = hash;
        log.info('Password 🔑 has been changed')
    }

})


const User = mongoose.model<UserDocument>("User", UserSchema);

export default User;