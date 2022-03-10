import {User} from "./user.model";
import {Column, CreateDateColumn, DeleteDateColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {Length} from "class-validator";

export interface ScooterProps {
    name: string;
    user?: User;
}

export class Scooter implements ScooterProps {

    @PrimaryGeneratedColumn("uuid")
    id: string;


    @Length(5, 50)
    @Column({nullable: false, length: 50})
    name: string;

    @ManyToOne(() => User, user => user.scooters, {nullable: true, eager: true})
    user: User;

    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()
    updatedAt: Date;
    @DeleteDateColumn()
    deletedAt: Date;
}
