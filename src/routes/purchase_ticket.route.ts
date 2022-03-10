import express from "express";
import {PurchaseTicketController} from "../controllers/purchaseTicket.controller";
import {User} from "../models/user.model";
import {logger} from "../config/logging.config";

const purchaseTicketRouter =  express.Router();

purchaseTicketRouter.get("/me", async (req, res) => {
    try {
        const purchaseTicketController = PurchaseTicketController.getInstance();
        const users = await purchaseTicketController.getRequestTicket((req.user as User).id);
        res.json(users);
    } catch (error) {
        logger.error(`${req.route.path} \n ${error}`);
        res.status(400).json(error);
    }
});

purchaseTicketRouter.put("/ticket", async (req, res) => {
    try {
        const purchaseTicketController = PurchaseTicketController.getInstance();
        const updateTicket = await purchaseTicketController.updateTicket((req.user as User).id, req.ticketId, req.body);
        res.json(updateTicket);
    } catch (error) {
        logger.error(`${req.route.path} \n ${error}`);
        res.status(400).json(error);
    }
});

purchaseTicketRouter.put("/point", async (req, res) => {
    try {
        const purchaseTicketController = PurchaseTicketController.getInstance();
        const userPoint = await purchaseTicketController.updatetUserPoint((req.user as User));
        res.json(userPoint);
    } catch (error) {
        logger.error(`${req.route.path} \n ${error}`);
        res.status(400).json(error);
    }
});

purchaseTicketRouter.put("/use-date", async (req, res) => {
    try {
        const purchaseTicketController = PurchaseTicketController.getInstance();
        const useDate = await purchaseTicketController.updateUseDate(req.purchaseTicketId, req.body);
        res.json(useDate);
    } catch (error) {
        logger.error(`${req.route.path} \n ${error}`);
        res.status(400).json(error);
    }
});

purchaseTicketRouter.delete("/remove", async (req, res) => {
    try {
        const purchaseTicketController = PurchaseTicketController.getInstance();
        const removeTicket = await purchaseTicketController.removeTicket((req.user as User).id, req.ticketId);
        res.json(removeTicket);
    } catch (error) {
        logger.error(`${req.route.path} \n ${error}`);
        res.status(400).json(error);
    }
});

export {
    purchaseTicketRouter
}