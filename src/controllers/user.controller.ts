import {User, UserProps} from "../models/user.model";
import {Conversation} from "../models/conversation.model";
import {DeleteResult, getRepository, Repository} from "typeorm";
import {validate} from "class-validator";

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

    public async create(props: UserProps): Promise<User>{
        const user = this.userRepository.create({
            ...props
        });

        const err = await validate(user);
        if(err.length > 0){
            throw err;
        }
        return this.userRepository.save(user);
    }

    public async getByUserId(userId: string): Promise<User> {
        return await this.userRepository.findOneOrFail({where: {id: userId}});
    }

    public async getByUsername(username: string): Promise<User> {
        return await this.userRepository.findOneOrFail({where: {username: username}});
    }

    public async getAll(): Promise<User[]> {
        console.log("getAll")
        return await this.userRepository.find();
    }

    public async updateUser(userId: string, props: UserProps): Promise<User>{
        await this.userRepository.createQueryBuilder()
            .update()
            .set(props)
            .where("id=:userId", {userId})
            .execute()

        return this.getByUserId(userId);
    }

    public async deleteUser(idUser: string): Promise<DeleteResult>{
        return await this.userRepository.softDelete(idUser);
    }

}
