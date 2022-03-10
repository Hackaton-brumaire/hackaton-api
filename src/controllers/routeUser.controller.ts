import {getRepository, Repository} from "typeorm";
import {RouteUser} from "../models/route_user.model";
import {User} from "../models/user.model";

export class RouteUserController{
    private static instance : RouteUserController;

    private routeUserRepository : Repository<RouteUser>;
    private userRepository : Repository<User>;


    constructor() {
        this.routeUserRepository = getRepository(RouteUser);
        this.userRepository = getRepository(User);
    }

    public static getInstance(): RouteUserController{
        if (RouteUserController.instance === undefined) {
            RouteUserController.instance = new RouteUserController();
        }
        return RouteUserController.instance;
    }

    public async getById(id : string) : Promise<RouteUser>{
        return await this.routeUserRepository.findOneOrFail(id);
    }

    public async getByUser(user : User) : Promise<RouteUser[]>{
        return this.routeUserRepository.createQueryBuilder()
            .leftJoin('RouteUser.User','User')
            .where('User.id=:user',{user})
            .orderBy("Message.createdAt", "ASC")
            .getMany();
    }

    public async getAllPosition() : Promise<RouteUser[]>{
        return this.routeUserRepository.find();
    }
}