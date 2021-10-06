import {Request, Response} from "express";
import { createUser } from "../services/UserService";
import { omit } from "lodash";
import log from "../helpers/logger";

export async function createUserHandler(req: Request, res:Response) {
    try {
        const user = await createUser(req.body);
        return res.send(omit(user.toJSON(), "password"))
    }catch(error: any){
        log.error(error);
        return res.status(409).send(error.message);
    }
}

export async function createUserSessionHandler(req: Request, res:Response) {
    try {
        //validate couple mail/pwd

        //create a session

        //create access token

        //create refresh token

        //send
    }catch(error: any) {

    }
}