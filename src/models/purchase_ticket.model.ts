import {User} from "./user.model";
import {Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, UpdateDateColumn, PrimaryGeneratedColumn, BeforeInsert} from "typeorm";
import {IsDate} from "class-validator";

export interface PurchaseTicketProps {
    user?: User;
    rechargeStationId?: string;
    availabilityDate?: Date;
}

@Entity()
export class PurchaseTicket implements PurchaseTicketProps {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @IsDate()
    @Column({default: null, nullable: true })
    availabilityDate: Date;

    @ManyToOne(() => User, user => user.purchaseTickets, { onDelete:"CASCADE"})
    user: User;

    @Column({default: null, nullable: true })
    rechargeStationId: string;


    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()
    updatedAt: Date;
    @DeleteDateColumn()
    deletedAt: Date;
}
