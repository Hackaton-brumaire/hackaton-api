import {getRepository, Repository} from "typeorm";
import Post = Faker.Post;
import {Faq, FaqProps} from "../models/faq.model";
import {validate} from "class-validator";

export class FaqController {

    private static instance: FaqController;

    private faqRepository: Repository<Faq>;

    private constructor() {
        this.faqRepository = getRepository(Faq);
    }

    public static getInstance(): FaqController {
        if (FaqController.instance === undefined){
            FaqController.instance = new FaqController();
        }
        return FaqController.instance;
    }

    public async create(props: FaqProps): Promise<Faq> {
        const faq = this.faqRepository.create({...props});
        const err = await validate(faq);
        if (err.length > 0){
            throw err;
        }
        return this.faqRepository.save(faq);
    }

    public async getAll(): Promise<Faq[]> {
        return this.faqRepository.find();
    }

    public async getById(faqId: string): Promise<Faq> {
        return this.faqRepository.findOneOrFail(faqId);
    }

    public async update(faqId: string, props: FaqProps): Promise<Faq> {
        await this.faqRepository.update(faqId, props);
        return this.getById(faqId);
    }

    public async delete(faqId: string): Promise<void> {
        await this.faqRepository.delete(faqId);
    }
}
