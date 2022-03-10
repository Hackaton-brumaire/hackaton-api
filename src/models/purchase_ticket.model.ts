import {User} from "./user.model";
import {Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, UpdateDateColumn} from "typeorm";
import {IsDate, IsDefined} from "class-validator";

export interface PurchaseTicketProps {
    user: User;
    useDate?: Date;
    rechargeStationId?: string;
}

@Entity()
export class PurchaseTicket implements PurchaseTicketProps {

    @ManyToOne(() => User, user => user.purchaseTickets, { onDelete:"CASCADE"})
    user: User;

    @Column({default: null, nullable: true })
    rechargeStationId: string;

    @IsDate()
    @IsDefined()
    @Column({ nullable: true })
    useDate: Date;

    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()
    updatedAt: Date;
    @DeleteDateColumn()
    deletedAt: Date;
}
