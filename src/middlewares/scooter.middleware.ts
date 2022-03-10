import {logger} from "../config/logging.config";
import {ConversationController} from "../controllers/conversation.controller";
import {User, UserType} from "../models/user.model";
import {ScooterController} from "../controllers/scooter.controller";

export async function isScooterOwner(req, res, next) {
    try {
        const scooterId = req.params.scooterId;
        const scooterController = ScooterController.getInstance();
        if (!req.user && (!((await scooterController.getById(scooterId)).id === (req.user as User).id) || !(req.user && (req.user as User).userType === UserType.ADMIN))) {
            return res.status(403).end();
        }
        next();
    } catch (e) {
        logger.error("middleware isConversationMember: " + e);
        res.status(400).end();
    }
}
