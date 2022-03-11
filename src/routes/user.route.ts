import express from "express";
import {UserController} from "../controllers/user.controller";
import {isAdmin} from "../middlewares/user.middleware";
import {logger} from "../config/logging.config";

const userRouter =  express.Router();


/*Create*/
userRouter.put('/', isAdmin, async (req, res)=>{
    const username = req.body.username;
    const mail = req.body.mail;
    const password = req.body.password;

    if(username === undefined){
        res.status(404).send('Name undefined').end();
        return;
    }
    if(mail === undefined){
        res.status(404).send('Mail undefined').end();
        return;
    }
    if(password === undefined){
        res.status(404).send('Password undefined').end();
        return;
    }

    const userController = await UserController.getInstance();
    const userCreated = await userController.create({
        username,
        mail,
        password
    });

    if(userCreated){
        res.json(userCreated)
        res.status(200).end();
        return;
    }

    res.status(500).send('Internal Server Error').end();
    return;
});


/*Get by id*/
userRouter.get('/:userId', async (req, res)=>{
    try {
        const userId = req.params.userId;
        if(userId === undefined){
            res.status(400).send('UserId undefined').end();
            return;
        }

        const userController = await UserController.getInstance();
        const user = await userController.getById(userId);
        if(user){
            res.json(user);
            res.status(201).end();
        }
    } catch (error){

        logger.error(`${req.route.path} \n ${error}`);
        res.status(404).send('User not found').end();
        return;
    }

});

/* Get by Username */
userRouter.get('/name/:username', async (req, res)=>{

    try {
        const username = req.params.username;
        if(username === undefined){
            res.status(400).send('Username undefined').end();
            return;
        }

        const userController = await UserController.getInstance();

        const user = await userController.getByUsername(username);

        res.json(user);
        res.status(201).end();

    } catch (error){

        logger.error(`${req.route.path} \n ${error}`);
        res.status(404).send('User not found').end();
        return;
    }

});

/* GetAll*/
userRouter.get('/', async (req, res)=>{
    const userController = await UserController.getInstance();

    const user = await userController.getAll();
    if(user){
        res.json(user);
        res.status(201).end();
        return;
    }
    res.status(404).send('No Users').end();
    return;

});

/*Update*/
userRouter.post('/:userId', async (req, res, next)=>{
    try {
        const userId = req.params.userId;
        if(userId === undefined){
            res.status(400).send('UserId undefined').end();
            return;
        }

        const username = req.body.username;
        const mail = req.body.mail;
        const password = req.body.password;

        if(username === undefined){
            res.status(400).send('Username undefined').end();
            return;
        }
        if(mail === undefined){
            res.status(400).send('mail undefined').end();
            return;
        }
        if(password === undefined){
            res.status(400).send('Password undefined').end();
            return;
        }

        const userController = await UserController.getInstance();
        const userUpdated = await userController.updateUser(userId, {
            username,
            mail,
            password
        });

        logger.info(`Get User with id : ${userId}`);
        res.json(userUpdated);
        res.status(201).end();


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
        return;
    }

    const userController = await UserController.getInstance();

    const userDeleted = await userController.deleteUser(userId);
    if(userDeleted){
        res.json(userDeleted);
        res.status(201).end();
    }

    res.status(500).send('').end();
    return;
});


export {
    userRouter
}
