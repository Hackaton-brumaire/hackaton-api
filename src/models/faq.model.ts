import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

export interface faqProps {
    ask: string;
    response: string;
}

@Entity()
export class Faq implements faqProps {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({unique: false, nullable: false})
    ask: string;

    @Column({unique: false, nullable: false})
    response: string;

}
