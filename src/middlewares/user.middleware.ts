import {User, UserType} from "../models/user.model";
import {UserController} from "../controllers/user.controller";
import {logger} from "../config/logging.config";

export async function isAdmin(req, res, next) {
    if (!(req.user && (req.user as User).userType === UserType.ADMIN)) {
        return res.status(403).end();
    }
    next();
}

export async function isExpert(req, res, next) {
    if (!(req.user && (req.user as User).userType === UserType.EXPERT)) {
        return res.status(403).end();
    }
    next();
}
