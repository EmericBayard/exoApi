import Session, { SessionDocument } from "../models/SessionModel";
import { LeanDocument } from "mongoose";
import { sign, decode } from "../helpers/JwtUtils";
import config from "config";
import { get } from "lodash";
import { findUser } from "../services/UserService";
import User, { UserDocument } from '../models/UserModel';
import { FilterQuery, UpdateQuery } from "mongoose";

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

export async function reIssueAccessToken({
    refreshToken,
}:{
    refreshToken: string;
}) {
    const { decoded } = decode(refreshToken)

    if(!decoded || !get(decoded, "_id")) return false; //or if(!decoded || !decoded?._id)

    const session = await Session.findById(get(decoded, "_id"));

    if(!session || !session?.valid) return false;

    const user = await findUser({_id: session.user})

    if(!user) return false;

    const accessToken = createAccessToken({user, session});
}

export async function updateSession(
    query: FilterQuery<SessionDocument>,
    update:UpdateQuery<SessionDocument>
) {
    return Session.updateOne(query, update);
}