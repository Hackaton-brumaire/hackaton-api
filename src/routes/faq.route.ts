import express from "express";
import {ensureLoggedIn} from "../middlewares/auth.middleware";
import {isAdmin} from "../middlewares/user.middleware";
import {FaqController} from "../controllers/faq.controller";
import {logger} from "../config/logging.config";
import {User} from "../models/user.model";
import {cachedDataVersionTag} from "v8";

const faqRouter =  express.Router();

// TODO: faqRouter
// TODO: CRUD

faqRouter.post("/", ensureLoggedIn, isAdmin, async (req, res) => {
    try {
        const faqController = FaqController.getInstance();
        const faq = await faqController.create(req.body);
        logger.info(`User ${(req.user as User).username} created new faq ${req.body.id}`);
        res.json(faq);
    } catch (error) {
        logger.error(`${req.route.path} \n ${error}`);
        res.status(404).json(error);
    }
});

faqRouter.get("/", async (req, res) =>  {
    try {
        const faqController = await FaqController.getInstance();
        const faqs = await faqController.getAll()
        res.json(faqs);
    } catch (error) {
        logger.error(`${req.route.path} \n ${error}`);
        res.status(404).json(error);
    }
});

faqRouter.get("/:id", async (req, res) => {
    try {
        const faqId = req.params.id;
        const faqController = await FaqController.getInstance();
        const faq = await faqController.getById(faqId)
        res.json(faq);
    }catch (error) {
        logger.error(`${req.route.path} \n ${error}`);
        res.status(404).json(error);
    }
});

faqRouter.put("/:faqId", ensureLoggedIn, isAdmin, async (req, res) => {
    try {
        const faqId = req.params.faqId;
        const faqController = FaqController.getInstance();
        const faq = await faqController.update(faqId, {...req.body})
        logger.info(`User ${(req.user as User).username} modified faq named ${faq.id}`);
        res.json(faq);
    }catch (error){
        logger.error(`${req.route.path} \n ${error}`);
        res.status(400).json(error);
    }
});

faqRouter.delete("/:faqId", async (req, res) => {
   try {
        const faqId = req.params.faqId;
        const faqController = FaqController.getInstance();
        await faqController.delete(faqId);
        logger.info(`User ${(req.user as User).username} deleted faq with id ${faqId}`);
        res.status(204).end();
   } catch (error) {
        logger.error(`${req.route.path} \n ${error}`);
        res.status(400).json(error);
   }
});

export {
    faqRouter
}
