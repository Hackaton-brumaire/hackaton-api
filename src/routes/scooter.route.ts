import express from "express";
import {ensureLoggedIn} from "../middlewares/auth.middleware";
import {isAdmin} from "../middlewares/user.middleware";
import {logger} from "../config/logging.config";
import {ScooterController} from "../controllers/scooter.controller";
import {User} from "../models/user.model";
import {isScooterOwner} from "../middlewares/scooter.middleware";

const scooterRouter = express.Router();

scooterRouter.post("/", ensureLoggedIn, isAdmin, async (req, res) => {
   try {
       const scooterController = await ScooterController.getInstance();
       const scooter = await scooterController.create(req.body);
       logger.info(`User ${(req.user as User).username} created new scooter ${req.body.name}`);
       res.json(scooter);
   } catch (error) {
       logger.error(`${req.route.path} \n ${error}`);
       res.status(404).json(error);
   }
});

scooterRouter.get("/", ensureLoggedIn, isAdmin, async (req, res)=> {
   try {
       const scooterController = await ScooterController.getInstance();
       const scooters = await scooterController.getAll();
       res.json(scooters);
   } catch (error) {
       logger.error(`${req.route.path} \n ${error}`);
       res.status(404).json(error);
   }
});

scooterRouter.get("/:scooterId", ensureLoggedIn, async (req, res) => {
   try {
       const scooterId = req.params.scooterId;
       const scooterController = await ScooterController.getInstance();
       const scooter = await scooterController.getById(scooterId);
       res.json(scooter);
   } catch (error) {
       logger.error(`${req.route.path} \n ${error}`);
       res.status(404).json(error);
   }
});

scooterRouter.put("/:scooterId", ensureLoggedIn, isAdmin, async (req, res) => {
   try {
       const scooterId = req.params.scooterId;
       const scooterController = await ScooterController.getInstance();
       const scooter = await scooterController.update(scooterId, {...req.body});
       logger.info(`User ${(req.user as User).username} modified scooter with id ${scooter.id}`);
       res.json(scooter);
   } catch (error) {
       logger.error(`${req.route.path} \n ${error}`);
       res.status(404).json(error);
   }
});

scooterRouter.delete("/:scooterId",ensureLoggedIn, isAdmin, async (req, res) => {
   try {
       const scooterId = req.params.scooterId;
       const scouterController = await ScooterController.getInstance();
       await scouterController.delete(scooterId);
       logger.info(`User ${(req.user as User).username} deleted scooter with id ${scooterId}`);
       res.status(204).end();
   } catch (error) {
       logger.error(`${req.route.path} \n ${error}`);
       res.status(400).json(error);
   }
});

scooterRouter.put("/addUser/:scooterId", ensureLoggedIn
    , async (req, res)=> {
    try {
        const scooterId = req.params.scooterId;
        const scooterController = await ScooterController.getInstance();
        await scooterController.addUserToScooter(scooterId, (req.user as User).id);
        logger.info(`User ${(req.user as User).username} join scooter with id ${scooterId}`);
    } catch (error) {
        logger.error(`${req.route.path} \n ${error}`);
        res.status(400).json(error);
    }
});

scooterRouter.put("/removeUser/:scooterId", ensureLoggedIn, isScooterOwner, async (req, res)=> {
    try {
        const scooterId = req.params.scooterId;
        const scooterController = await ScooterController.getInstance();
        await scooterController.removeUserToScooter(scooterId, (req.user as User).id);
        logger.info(`User ${(req.user as User).username} join scooter with id ${scooterId}`);
    } catch (error) {
        logger.error(`${req.route.path} \n ${error}`);
        res.status(400).json(error);
    }
});

export {
    scooterRouter
}
