import {BeforeInsert, Entity, getRepository, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {Conversation} from "./conversation.model";
import {User} from "./user.model";

export interface ActiveConversationProps{
    customer: User;
    expert: User;
}
@Entity()
export class ActiveConversation {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => User, user => user.customers, {primary: true, onDelete: "CASCADE"})
    customer: User;
    @ManyToOne(() => User, user => user.experts, {primary: true,onDelete: "CASCADE"})
    expert: User;

    @OneToOne(() => Conversation, conversation => conversation, {cascade: true})
    @JoinColumn()
    conversation: Conversation;

    @BeforeInsert()
    async setConversation() {
        this.conversation = await getRepository(Conversation).save(new Conversation());
    }
}
