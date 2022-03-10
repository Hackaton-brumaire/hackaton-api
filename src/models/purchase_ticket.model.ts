import {User} from "./user.model";
import {Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, UpdateDateColumn, PrimaryGeneratedColumn, BeforeInsert} from "typeorm";
import {IsDate, IsDefined} from "class-validator";

export interface PurchaseTicketProps {
    user: User;
    useDate?: Date;
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

    @IsDate()
    @Column({ default:null, nullable: true })
    useDate: Date;

    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()
    updatedAt: Date;
    @DeleteDateColumn()
    deletedAt: Date;

    
    @BeforeInsert()
    async set(password: string) {
        this.password = await hash(password || this.password, 10)
    }
}
