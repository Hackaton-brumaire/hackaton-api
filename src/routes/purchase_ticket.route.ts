import express from "express";
import {PurchaseTicketController} from "../controllers/purchaseTicket.controller";
import {User} from "../models/user.model";
import {logger} from "../config/logging.config";
import {ensureLoggedIn} from "../middlewares/auth.middleware";

const purchaseTicketRouter =  express.Router();

purchaseTicketRouter.get("/me", ensureLoggedIn, async (req, res) => {
    try {
        const purchaseTicketController = PurchaseTicketController.getInstance();
        const users = await purchaseTicketController.getRequestTicket((req.user as User).id);
        res.json(users);
    } catch (error) {
        logger.error(`${req.route.path} \n ${error}`);
        res.status(400).json(error);
    }
});

purchaseTicketRouter.put("/", ensureLoggedIn, async (req, res) => {
    try {
        const purchaseTicketController = PurchaseTicketController.getInstance();
        const updateTicket = await purchaseTicketController.updateTicket((req.user as User).id, req.body.ticketId, req.body);
        res.json(updateTicket);
    } catch (error) {
        logger.error(`${req.route.path} \n ${error}`);
        res.status(400).json(error);
    }
});

purchaseTicketRouter.put("/point", ensureLoggedIn, async (req, res) => {
    try {
        const purchaseTicketController = PurchaseTicketController.getInstance();
        const userPoint = await purchaseTicketController.updatetUserPoint((req.user as User).id);
        res.json(userPoint);
    } catch (error) {
        logger.error(`${req.route.path} \n ${error}`);
        res.status(400).json(error);
    }
});

purchaseTicketRouter.put("/use-ticket/:ticketId", async (req, res) => {
    try {
        const ticketId = req.params.ticketId;
        const purchaseTicketController = PurchaseTicketController.getInstance();
        const deleteResult = await purchaseTicketController.updateUseDate(ticketId, req.body);
        res.json(deleteResult);
    } catch (error) {
        logger.error(`${req.route.path} \n ${error}`);
        res.status(400).json(error);
    }
});

purchaseTicketRouter.delete("/", async (req, res) => {
    try {
        const purchaseTicketController = PurchaseTicketController.getInstance();
        const removeTicket = await purchaseTicketController.removeTicket((req.user as User).id, req.body.ticketId);
        res.json(removeTicket);
    } catch (error) {
        logger.error(`${req.route.path} \n ${error}`);
        res.status(400).json(error);
    }
});

export {
    purchaseTicketRouter
}
