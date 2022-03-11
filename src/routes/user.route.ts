import express from "express";
import {UserController} from "../controllers/user.controller";
import {isAdmin} from "../middlewares/user.middleware";
import {logger} from "../config/logging.config";
import {ensureLoggedIn} from "../middlewares/auth.middleware";
import {User} from "../models/user.model";

const userRouter =  express.Router();


/*Create*/
userRouter.put('/', isAdmin, async (req, res)=>{
    const username = req.body.username;
    const mail = req.body.mail;
    const password = req.body.password;

    if(username === undefined){
        res.status(404).send('Name undefined').end();
    }
    if(mail === undefined){
        res.status(404).send('Mail undefined').end();
    }
    if(password === undefined){
        res.status(404).send('Password undefined').end();
    }

    const userController = await UserController.getInstance();
    const userCreated = await userController.create({
        username,
        mail,
        password
    });

    if(userCreated){
        res.json(userCreated);
    }

    res.status(500).send('Internal Server Error').end();
});

userRouter.get("/me",ensureLoggedIn, async (req, res) => {
   try {
       const userController = UserController.getInstance();
       const user = userController.getById((req.user as User).id);
       res.json(user);

   } catch (error){
       logger.error(`${req.route.path} \n ${error}`);
       res.status(404).send('User not found').end();
   }
});

/*Get by id*/
userRouter.get('/:userId', async (req, res)=>{
    try {
        const userId = req.params.userId;
        if(userId === undefined){
            res.status(400).send('UserId undefined').end();
        }

        const userController = await UserController.getInstance();
        const user = await userController.getById(userId);
        if(user){
            res.json(user);
        }
    } catch (error){

        logger.error(`${req.route.path} \n ${error}`);
        res.status(404).send('User not found').end();
    }

});

/* Get by Username */
userRouter.get('/name/:username', async (req, res)=>{

    try {
        const username = req.params.username;
        if(username === undefined){
            res.status(400).send('Username undefined').end();
        }

        const userController = await UserController.getInstance();

        const user = await userController.getByUsername(username);

        res.json(user);

    } catch (error){

        logger.error(`${req.route.path} \n ${error}`);
        res.status(404).send('User not found').end();
    }

});

/* GetAll*/
userRouter.get('/', async (req, res)=>{
    const userController = await UserController.getInstance();

    const user = await userController.getAll();
    if(user){
        res.json(user);
    }
    res.status(404).send('No Users').end();
});

/*Update*/
userRouter.post('/:userId', async (req, res, next)=>{
    try {
        const userId = req.params.userId;
        if(userId === undefined){
            res.status(400).send('UserId undefined').end();
        }

        const username = req.body.username;
        const mail = req.body.mail;
        const password = req.body.password;

        if(username === undefined){
            res.status(400).send('Username undefined').end();
        }
        if(mail === undefined){
            res.status(400).send('mail undefined').end();
        }
        if(password === undefined){
            res.status(400).send('Password undefined').end();
        }

        const userController = await UserController.getInstance();
        const userUpdated = await userController.updateUser(userId, {
            username,
            mail,
            password
        });

        logger.info(`Get User with id : ${userId}`);
        res.json(userUpdated);


    } catch (error){
        logger.error(`${req.route.path} \n ${error}`);
        res.status(500).json(error);
    }


});

/*Delete*/
userRouter.delete('/:userId', async (req, res)=>{

    const userId = req.params.userId;

    if(userId === undefined){
        res.status(400).send('UserID undefined').end();
    }

    const userController = await UserController.getInstance();

    const userDeleted = await userController.deleteUser(userId);
    if(userDeleted){
        res.json(userDeleted);
        res.status(201).end();
    }

    res.status(500).send('').end();
});


export {
    userRouter
}
