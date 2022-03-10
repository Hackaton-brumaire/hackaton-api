import {User, UserProps} from "../models/user.model";
import {Conversation} from "../models/conversation.model";
import {DeleteResult, getRepository, Repository} from "typeorm";

export class UserController {

    private static instance: UserController;

    private userRepository: Repository<User>;
    private conversationRepository: Repository<Conversation>;

    private constructor() {
        this.userRepository = getRepository(User);
        this.conversationRepository = getRepository(Conversation);
    }

    public static getInstance(): UserController {
        if (UserController.instance === undefined) {
            UserController.instance = new UserController();
        }
        return UserController.instance;
    }

    public async getByUserId(userId: string): Promise<User> {
        return await this.userRepository.findOneOrFail({where: {userId: userId}});
    }

    public async getByUsername(username: string): Promise<User> {
        return await this.userRepository.findOneOrFail({where: {username: username}});
    }

    public async getAll(): Promise<User[]> {
        return await this.userRepository.find();
    }

    public async updateUser(userId: string, props: UserProps): Promise<User>{
        await this.userRepository.createQueryBuilder()
            .update()
            .set(props)
            .where("userid=:userId", {userId})
            .execute()

        return this.getByUserId(userId);
    }

    public async deleteUser(idUser: string): Promise<DeleteResult>{
        return await this.userRepository.softDelete(idUser);
    }


    //TODO: GetConversation()
    //TODO: A voire pour mettre un GetRouteUser()
}
