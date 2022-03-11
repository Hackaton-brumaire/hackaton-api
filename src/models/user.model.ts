import {
    BeforeInsert,
    Column,
    CreateDateColumn, DeleteDateColumn,
    Entity, JoinColumn,
    OneToMany, OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {IsEmail, IsNotEmpty, Length} from "class-validator";
import {RouteUser} from "./route_user.model";
import {hash} from "bcrypt";
import {PurchaseTicket} from "./purchase_ticket.model";
import {ActiveConversation} from "./active_conversation.model";
import {Message} from "./message.model";
import {Scooter} from "./scooter.model";

export enum UserType {
    USER = "USER",
    ADMIN =  "ADMIN",
    EXPERT = "EXPERT"
}

export interface UserProps {
    username: string;
    mail: string;
    password: string;
    userType?: UserType;
}

@Entity()
export class User implements UserProps {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Length(5, 20)
    @IsNotEmpty()
    @Column({unique: true, nullable: false, length: 20})
    username: string;

    @IsEmail()
    @Column({unique: true, nullable: false})
    mail: string;

    @Column({unique: false, nullable: false, select: false})
    password: string;

    @Column({type: "enum", enum: UserType, default: UserType.USER, nullable: false})
    userType: UserType;

    @OneToMany(() => RouteUser, routeUser => routeUser.user)
    routesDone: RouteUser[];

    @Column({type: "int", nullable: false, default: 0})
    score: number;

    @Column({type: "int", nullable: false, default: 0})
    allTimeScore: number;

    @OneToMany(() => PurchaseTicket, purchaseTicket => purchaseTicket.user, {cascade: true, eager: true})
    purchaseTickets: PurchaseTicket[];

    @OneToMany(() => ActiveConversation, activeConversation => activeConversation.customer, {cascade: true, onDelete:"SET NULL"})
    customers: ActiveConversation[];
    @OneToMany(() => ActiveConversation, activeConversation => activeConversation.expert, {cascade: true,  onDelete:"SET NULL"})
    experts: ActiveConversation[];

    @OneToMany(() => Message, message => message.user, {cascade: true, onDelete:"CASCADE"})
    messages: Message[];

    @Column({select: false, nullable: true})
    resetToken: string;

    @Column({select: false, nullable: true})
    resetTokenExpiration: Date;

    @OneToOne(() => Scooter, scooter => scooter.user, {cascade: true, onDelete:'SET NULL', eager: true, nullable: true})
    @JoinColumn()
    scooter: Scooter[];

    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()
    updatedAt: Date;
    @DeleteDateColumn()
    deletedAt: Date;

    @BeforeInsert()
    async setPassword(password: string) {
        this.password = await hash(password || this.password, 10)
    }
}
