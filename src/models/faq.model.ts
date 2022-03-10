import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

export interface FaqProps {
    ask: string;
    response: string;
}

@Entity()
export class Faq implements FaqProps {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({unique: false, nullable: false})
    ask: string;

    @Column({unique: false, nullable: false})
    response: string;

}
