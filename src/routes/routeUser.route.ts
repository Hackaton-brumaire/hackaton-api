import express from "express";
import {ensureLoggedIn} from "../middlewares/auth.middleware";
import {RouteUserController} from "../controllers/routeUser.controller";
import {logger} from "../config/logging.config";
import {PositionsTrip} from "../models/route_user.model";
import {User} from "../models/user.model";
import {isAdmin} from "../middlewares/user.middleware";
import {userRouter} from "./user.route";
import {UserController} from "../controllers/user.controller";
const axios = require('axios');

const routeUserRouter =  express.Router();
routeUserRouter.get('/',ensureLoggedIn, async (req,res)=>{
    try{
        const routeUserController = await RouteUserController.getInstance();
        const userRoutes = await routeUserController.getAllPosition();
        if(userRoutes === null)
            res.status(204).end();
        else{
            res.status(200);
            res.json(userRoutes).end()
        }
    }catch (e){
        logger.error(`${req.route.path} \n ${e}`);
        res.status(400).json(e).end();
    }
});

routeUserRouter.get('/userId/:id',ensureLoggedIn,async (req,res) =>{
    const userId = req.params.id;
    if(userId === null || userRouter === undefined){
        res.status(400).end();
        return;
    }
    const userController = await UserController.getInstance();
    const user = await userController.getById(userId);
    if(user === null){
        res.status(400).end();
        return;
    }

    const routeUserController = await RouteUserController.getInstance();
    const routesUser = await routeUserController.getByUser(user);
    if(routesUser === null)
        res.status(204)
    else
        res.status(200);
    res.json(routesUser).end();
});

routeUserRouter.post('/create',ensureLoggedIn, async(req,res)=>{
    if (!(req.body === null || req.body === undefined)) {
        res.status(400).end();
        return;
    }
    let positionsTrips: PositionsTrip[] = [];
    for (let position in req.body) {
        positionsTrips.push({
            latitude: Number(position["latitude"]),
            longitude: Number(position["longitude"]),
            timestamp: position["timestamp"]
        });
    }
    let distance : number = 0;
    for (let i = 0; i < positionsTrips.length - 1; i++) {
        const position1 = positionsTrips[i].latitude + ',' + positionsTrips[i].longitude;
        const position2 = positionsTrips[i + 1].latitude + ',' + positionsTrips[i + 1].longitude;

        const config = {
            method: 'get',
            url: 'https://maps.googleapis.com/maps/api/distancematrix/json?origins=' + position1 + '&destinations=' + position2 +'&units=metric&key=AIzaSyCGtPwGNYa-_NBmRht_r_acXsanChReTbg',
            headers: { }
        };

        await axios(config)
            .then(function (response) {return JSON.stringify(response.data);})
            .then(function(response){
                distance += Number(response["rows"][0]["element"][0]["distance"]["value"]);
                console.log("distance du trajet en cours de calcul : " + distance);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    console.log("distance calculée : " + distance);
    const routeUserController = await RouteUserController.getInstance();
    const routeUser = await routeUserController.create({
        startLatitude : Number(positionsTrips[0].latitude),
        startLongitude : Number(positionsTrips[0].longitude),
        endLatitude : Number(positionsTrips[positionsTrips.length - 1].latitude),
        endLongitude : Number(positionsTrips[positionsTrips.length - 1].longitude),
        user : req.user as User,
        startDate : new Date(Number(positionsTrips[0].timestamp)),
        endDate : new Date(Number(positionsTrips[positionsTrips.length - 1].timestamp)),
        distance : distance
    });
    if(routeUser != null){
        res.status(201);
        res.json(routeUser).end();
    }else
        res.status(400).end();

});


routeUserRouter.delete('/:userRouteId',isAdmin, async(req,res)=>{

    const userRouteId = req.params.userRouteId;
    if(userRouteId === undefined){
        res.status(404).send('UserRouterId not undefined').end();
        return;
    }

    const userRouterController = await RouteUserController.getInstance();

    const userDeleted = await userRouterController.delete(userRouteId);
    if(userDeleted){
        res.json(userDeleted);

    }


});


// TODO: CRUD

export {
    routeUserRouter
}
