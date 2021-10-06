import { Express, Request, Response } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { createUserHandler } from "../../controllers/UserController";
import { createUserSessionHandler } from "../../controllers/SessionController";
import { createUserSchema, createUserSessionSchema } from "../../schemas/UserSchema";
import { requiresUser } from "../../middlewares";
import { invalidateUserSessionHandler } from "../../controllers";
export default function (app: Express) {
    app.get("/healthcheck", (req: Request, res: Response) => res.sendStatus(200));

    //Register user
    app.post("/api/users", validateRequest(createUserSchema), createUserHandler)
    // POST /api/user
    app.post("/api/sessions", validateRequest(createUserSessionSchema), createUserSessionHandler)
    //Login
    //POST /api/sessions

    //get the user's sessions
    //GET /api/sessions

    //Logout
    app.delete("/api/sessions", requiresUser, invalidateUserSessionHandler)
    //DELETE /api/sessions
}