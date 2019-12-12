import {NextFunction, Request, Response} from "express";
import * as jwt from "jsonwebtoken";
import config from "../config/config";

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.auth as string;
    let jwtPayload;

    try {
        jwtPayload = (jwt.verify(token, config.jwtSecret) as any);
        res.locals.jwtPayload = jwtPayload;
    } catch (error) {
        res.status(401).send();
        return;
    }

    const {userId, email} = jwtPayload;
    const newToken = jwt.sign({userId, email}, config.jwtSecret, {
        expiresIn: "1h",
    });
    res.setHeader("token", newToken);

    next();
};
