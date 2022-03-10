import {getRepository, Repository, UpdateResult} from "typeorm";
import {RouteUser, RouteUserProps} from "../models/route_user.model";
import {User} from "../models/user.model";
import {validate} from "class-validator";

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

    public async create(props : RouteUserProps) : Promise<RouteUser>{
        const routeUser = this.routeUserRepository.create({
            ...props
        });
        const err = await validate(routeUser);
        if(err.length > 0)
            throw err;
        return this.routeUserRepository.save(routeUser);
    }

    public async update(userRouteId: string, props: RouteUserProps): Promise<RouteUser>{
        await this.routeUserRepository.createQueryBuilder()
            .update()
            .set(props)
            .where("id=:userRouteId", {userRouteId})
            .execute()
        return this.getById(userRouteId);
    }

    public async delete(userRouteId: string): Promise<UpdateResult>{
        return await this.userRepository.softDelete(userRouteId);
    }

}