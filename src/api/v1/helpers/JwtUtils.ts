import jwt from "jsonwebtoken";
import config from "config";
import log from "./logger";
const privateKey = config.get("privateKey") as string;

export function sign(object: Object, option?: jwt.SignOptions | undefined) {
    return jwt.sign(object, privateKey, option);
}

export function decode(token: string) {
    try{
        const decoded = jwt.verify(token, privateKey);

        return {    valid: true, expired: false, decoded };
    }catch(e:any) {
        log.error(e)
        return {
            valid: false,
            expired:e.message === "jwt expired",
            decoded: null,
        }
    }
}