import {getRepository, Repository} from "typeorm";
import {Scooter, ScooterProps} from "../models/scooter.model";
import {validate} from "class-validator";
import {User} from "../models/user.model";

export class ScooterController {
    private static instance: ScooterController;

    private scooterRepository: Repository<Scooter>;

    public static getInstance(): ScooterController {
        if (ScooterController.instance === undefined) {
            ScooterController.instance = new ScooterController();
        }
        return ScooterController.instance;
    }

    public async create(props: ScooterProps): Promise<Scooter> {
        const scooter = this.scooterRepository.create({...props});
        const err = await validate(scooter);
        if (err.length > 0){
            throw err;
        }
        return this.scooterRepository.save(scooter);
    }

    public async getAll(): Promise<Scooter[]> {
        return this.scooterRepository.find();
    }

    public async getById(scooterId: string): Promise<Scooter> {
        return this.scooterRepository.findOneOrFail(scooterId);
    }

    public async update(scooterId: string, props: ScooterProps): Promise<Scooter> {
        await this.scooterRepository.update(scooterId, props);
        return this.getById(scooterId);
    }

    public async delete(scooterId: string): Promise<void> {
        await this.scooterRepository.delete(scooterId);
    }

    public async addUserToScooter(scooterId: string, userId: string): Promise<void> {
        await this.scooterRepository.createQueryBuilder()
            .relation("user")
            .of(scooterId)
            .add(userId);
    }

    public async removeUserToScooter(scooterId: string, userId: string): Promise<void> {
        const user = await getRepository(User).findOneOrFail(userId);
        await this.scooterRepository.createQueryBuilder()
            .relation("user")
            .of(scooterId)
            .remove(userId);
    }
}
