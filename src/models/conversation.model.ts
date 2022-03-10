import {
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {ActiveConversation} from "./active_conversation.model";
import {Message} from "./message.model";

@Entity()
export class Conversation {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @OneToMany(() => Message, message => message.conversation)
    messages: Message[];

    @OneToOne(() => ActiveConversation, activeConversation => activeConversation.conversation, {eager: true})
    activeConversation: ActiveConversation;

    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()
    updatedAt: Date;
    @DeleteDateColumn()
    deletedAt: Date;
}
