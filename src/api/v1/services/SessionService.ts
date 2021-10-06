import Session, { SessionDocument } from "../models/SessionModel";
import { LeanDocument } from "mongoose";
import { UserDocument } from "../models/UserModel";
import { sign } from "../helpers/JwtUtils";
import config from "config";


export async function createSession(userId: string, userAgent: string) {
    const session = await Session.create({ user: userId, userAgent});

    return session.toJSON();
}

export function createAccessToken({
    user,
    session,
} : {
    user:
        |Omit<UserDocument, "password">
        |LeanDocument<Omit<UserDocument, "password">>;
    session:
        |Omit<SessionDocument, "password">
        |LeanDocument<Omit<SessionDocument, "password">>;
}) {
    //Build the token
    const accessToken = sign(
        {...user, session: session._id},
        {expiresIn: config.get("accessTokenTtl") as string}
    );

    return accessToken; 
}