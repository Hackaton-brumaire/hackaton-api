import {getRepository, Repository} from "typeorm";
import {Conversation} from "../models/conversation.model";
import {Message, MessageProps} from "../models/message.model";
import {User} from "../models/user.model";
import {validate} from "class-validator";
import {ActiveConversation, ActiveConversationProps} from "../models/active_conversation.model";


export class ConversationController {
    private static instance: ConversationController;

    private conversationRepository: Repository<Conversation>;
    private messageRepository: Repository<Message>;

    private constructor() {
        this.conversationRepository = getRepository(Conversation);
        this.messageRepository = getRepository(Message);
    }

    public static getInstance(): ConversationController {
        if (ConversationController.instance === undefined) {
            ConversationController.instance = new ConversationController();
        }
        return ConversationController.instance;
    }

    public async getById(id: string): Promise<Conversation> {
        return this.conversationRepository.findOneOrFail(id);
    }

    public async getMessages(id: string): Promise<Message[]> {
        return this.messageRepository.createQueryBuilder()
            .leftJoinAndSelect("Message.user", "User")
            .leftJoin("Message.conversation", "Conversation")
            .where("Conversation.id=:id", {id})
            .orderBy("Message.createdAt", "ASC")
            .getMany();
    }

    public async getMembers(conversationId: string): Promise<User[]> {
        return (await this.getCustomers(conversationId))
            .concat(await this.getExperts(conversationId));
    }

    private async getCustomers(conversationId: string): Promise<User[]> {
        return await getRepository(User).createQueryBuilder()
            .leftJoin("User.customers", "ActiveConversation")
            .leftJoin("ActiveConversation.conversation", "Conversation")
            .where("Conversation.id=:conversation", {conversationId})
            .getMany()
    }

    private async getExperts(conversationId: string): Promise<User[]> {
        return await getRepository(User).createQueryBuilder()
            .leftJoin("User.experts", "ActiveConversation")
            .leftJoin("ActiveConversation.conversation", "Conversation")
            .where("Conversation.id=:conversation", {conversationId})
            .getMany()
    }

    public async sendMessage(user: User, conversation: Conversation, props: MessageProps): Promise<Message> {
        const message = this.messageRepository.create({...props, user, conversation});
        const err = await validate(message);
        if (err.length > 0) {
            throw err;
        }
        return this.messageRepository.save(message);
    }

    public async initConversation(user: User): Promise<Conversation> {
        let props: ActiveConversationProps = new class implements ActiveConversationProps {
            customer: User;
            expert: User;
        };
        props.customer = user;
        const experts: User[] = await getRepository(User).createQueryBuilder()
            .select()
            .where("User.userType='EXPERT'")
            .getMany();

        try {
            props.expert = experts[Math.floor(Math.random() * (experts.length + 1))];
        }catch (e){
            throw "There is no expert available";
        }

        const activeConversation = getRepository(ActiveConversation).create(props);
        await getRepository(ActiveConversation).save(activeConversation);
        return activeConversation.conversation
    }
}
