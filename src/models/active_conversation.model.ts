import {BeforeInsert, Entity, getRepository, JoinColumn, ManyToOne, OneToOne} from "typeorm";
import {Conversation} from "./conversation.model";
import {User} from "./user.model";

@Entity()
export class ActiveConversation {
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
