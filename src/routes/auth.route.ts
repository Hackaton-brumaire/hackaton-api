import express from "express";
import passport from "passport";
import {logger} from "../config/logging.config";
import {AuthController} from "../controllers/auth.controller";
import {ensureLoggedIn, ensureLoggedOut} from "../middlewares/auth.middleware";

const authRouter = express.Router();

authRouter.post('/login', ensureLoggedOut, passport.authenticate('local-hackaton-api'), async (req, res) => {
    logger.info(`User ${req.body.username} logged in`);
    res.json(req.user);
});

authRouter.post('/register', ensureLoggedOut, async (req, res, next) => {
        try {
            const authController = AuthController.getInstance();
            await authController.register({...req.body});
            logger.info(`Registering user with username: ${req.body.username}`);
            next();
        } catch (error) {
            logger.error(`${req.route.path} \n ${error}`);
            res.status(400).json(error);
        }
    },
    passport.authenticate('local-agir-pour-tous'),
    (req, res) => res.json(req.user));



authRouter.delete('/logout', ensureLoggedIn, async (req, res) => {
    req.logout();
    res.status(204).end();
});

export {
    authRouter
}
