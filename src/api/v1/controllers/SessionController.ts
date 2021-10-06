import { validatePassword } from "../services/UserService";
import { Request, Response } from "express";
import { createSession, createAccessToken, updateSession } from "../services/SessionService";
import { sign } from "../helpers/JwtUtils";
import config from "config";
import log from "../helpers/logger";
import { get } from "lodash"

export async function createUserSessionHandler(req: Request, res: Response) {
    //validate couple mail/pwd
    const user = await validatePassword(req.body);

    if(!user) {
        return res.send("Invalid ❌ username or password");
    }
    //create a session
    const session = await createSession(user._id, req.get("user-agent") || "");
    //create access token
    const accessToken = createAccessToken({
        user,
        session,
    });

    const refreshToken = sign(
        session,
        {
            expiresIn: config.get("refreshTokenTtl") as string,
    })
    //create refresh token
    return res.send({accessToken, refreshToken});
}

export async function invalidateUserSessionHandler(
    req:Request,
    res: Response,
) {
    const sessionId = get(req, "user.session");

    await updateSession({_id: sessionId}, { valid: false });

    return res.sendStatus(200);
}

