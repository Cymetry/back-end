import {Router} from "express";
import AuthController from "../controllers/AuthController";
import {checkJwt} from "../middlewares/checkJwt";

export const authRouter = Router();
// Login route
authRouter.post("/login", AuthController.login);

// Change my password
authRouter.post("/change-password", [checkJwt], AuthController.changePassword);

// verify email
authRouter.post("/verify", [checkJwt], AuthController.checkSecret);

// reset password email request
authRouter.get("/reset", AuthController.getResetPasswordEmail);

// reset password
authRouter.post("/reset", AuthController.resetPassword);

