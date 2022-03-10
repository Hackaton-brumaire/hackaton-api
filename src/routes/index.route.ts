import {Router} from "express";
import {logger} from "../config/logging.config";
import {TypeormStore} from "connect-typeorm";
import {getRepository} from "typeorm";
import {Session} from "../models/session.model";
import passport from "passport";
import {ensureLoggedIn} from "../middlewares/auth.middleware";
import {authRouter} from "./auth.route";
import {userRouter} from "./user.route";
import {isConversationMember} from "../middlewares/conversation.middleware";
import {conversationRouter} from "./conversation.route";
import {faqRouter} from "./faq.route";
import {routeUserRouter} from "./routeUser.route";
import {purchaseTicketRouter} from "./purchase_ticket.route";
import {configure} from "../config/passport.config";


export function buildRoutes() {
    const router = Router();
    configure()
    logger.info("Init routes")
    //router.use(require('cors')({credentials: true, origin: process.env.FRONT_WEB_URL}));
    router.use(require('cors')({credentials: true, origin: "*"}));
    router.use(require('express-session')({
        secret: process.env.APP_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 259200000,
            secure: false,
            sameSite: "lax"
        },
        store: new TypeormStore({
            cleanupLimit: 2,
            limitSubquery: false,
            ttl: 259200
        }).connect(getRepository(Session)),
    }));
    router.use(passport.initialize());
    router.use(passport.session());
    router.use("/auth", authRouter);
    router.use("/user", userRouter);
    router.use("/conversation", ensureLoggedIn, isConversationMember, conversationRouter);
    router.use("/faq", faqRouter);
    router.use("/route_user", routeUserRouter)
    router.use("/purchase_ticket", purchaseTicketRouter)

    return router;
}
