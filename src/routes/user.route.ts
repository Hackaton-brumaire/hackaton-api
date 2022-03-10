import express from "express";
import {UserController} from "../controllers/user.controller";
import {isAdmin} from "../middlewares/user.middleware";
import {ensureLoggedIn} from "../middlewares/auth.middleware";

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
    const userId = req.params.userId;
    if(userId === undefined){
        res.status(400).send('UserId undefined').end();
        return;
    }

    const userController = await UserController.getInstance();
    const user = userController.getByUserId(userId);
    if(user){
        res.json(user);
        res.status(201).end();
    }

    res.status(404).send('User not found').end();
    return;

});

/* Get by Username */
userRouter.get('/:username', async (req, res)=>{
    const username = req.params.username;
    if(username === undefined){
        res.status(400).send('Username undefined').end();
        return;
    }

    const userController = await UserController.getInstance();

    const user = userController.getByUsername(username);
    if(user){
        res.json(user);
        res.status(201).end();
        return;
    }

    res.status(404).send('User not found').end();
    return;

});

/* GetAll*/
userRouter.get('/', async (req, res)=>{
    const userController = await UserController.getInstance();

    const user = userController.getAll();
    if(user){
        res.json(user);
        res.status(201).end();
        return;
    }
    res.status(404).send('No Users').end();
    return;

});

/*Update*/
userRouter.post('/:userId', ensureLoggedIn, async (req, res)=>{
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
    const userUpdated = userController.updateUser(userId, {
        username,
        mail,
        password
    });

    if(userUpdated){
        res.json(userUpdated);
        res.status(201).end();
    }

    res.status(500).send('').end();
    return;
});

/*Delete*/
userRouter.delete('/:userId', async (req, res)=>{

    const userId = req.params.userId;

    if(userId === undefined){
        res.status(400).send('UserID undefined').end();
        return;
    }

    const userController = await UserController.getInstance();

    const userDeleted = userController.deleteUser(userId);
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
