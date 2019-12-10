import {NextFunction, Request, Response} from "express";

import {User} from "../lib/db/postgresSQL/models/User";

export const checkRole = (roles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = res.locals.jwtPayload.userId;

        let user: User | null;

        try {
            user = await User.findOne({where: {id}});
        } catch (id) {
            res.status(401).send();
            return;
        }

        if (user) {
            if (roles.indexOf(user.role) > -1) {
                next();
            } else {
                res.status(401).send();
            }
        } else {
            res.status(500).send("missing user record");
        }
    };
};
