import {User} from "./user.model";
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToOne, OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {Length} from "class-validator";

export interface ScooterProps {
    name: string;
    user?: User;
}

@Entity()
export class Scooter implements ScooterProps {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Length(5, 50)
    @Column({nullable: false, length: 50})
    name: string;

    @OneToOne(() => User, user => user.scooter, {nullable: true})
    user: User;

    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()
    updatedAt: Date;
    @DeleteDateColumn()
    deletedAt: Date;
}
