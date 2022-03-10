import {User} from "../models/user.model";
import {Conversation} from "../models/conversation.model";
import {getRepository, Repository} from "typeorm";

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

    public async getByUsername(username: string): Promise<User> {
        return await this.userRepository.findOneOrFail({where: {username: username}});
    }

    public async getAll(): Promise<User[]> {
        return await this.userRepository.find();
    }

    //TODO: UpdateUser()
    //TODO: DeleteUser()
    //TODO: GetConversation()
    //TODO: A voire pour mettre un GetRouteUser()
}
