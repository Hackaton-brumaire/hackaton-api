import {User, UserProps} from "../models/user.model";
import {getRepository, Repository} from "typeorm";
import {validate} from "class-validator";
import {hash} from "bcrypt";
import {logger} from "../config/logging.config";

export class AuthController {

    private static instance: AuthController;

    private userRepository: Repository<User>;

    private constructor() {
        this.userRepository = getRepository(User);
    }

    public static getInstance(): AuthController {
        if (AuthController.instance === undefined) {
            AuthController.instance = new AuthController();
        }
        return AuthController.instance;
    }


    public async register(props: UserProps): Promise<User> {
        const user = this.userRepository.create({...props});
        const err = await validate(user);
        if (err.length > 0) {
            throw err;
        }
        return await this.userRepository.save(user);
    }

    public async isValidToken(resetToken: string, username: string): Promise<boolean> {
        return (await this.userRepository.createQueryBuilder()
            .where("User.username=:username", {username})
            .andWhere("User.resetToken=:resetToken", {resetToken})
            .andWhere("User.resetTokenExpiration > NOW()")
            .getOne() !== undefined);
    }
}
