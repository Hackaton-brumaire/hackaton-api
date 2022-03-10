import {User} from "./user.model";
import {Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {IsDate, IsDefined, IsLatitude, IsLongitude} from "class-validator";
import {ManyToOne} from "typeorm";

export interface PositionsTrip{
    latitude : number;
    longitude : number;
    timestamp : Date;
}
export interface RouteUserProps {
    startLatitude: number;
    startLongitude: number;
    endLatitude: number;
    endLongitude: number;
    user: User;
    startDate: Date;
    endDate: Date;
    distance : number;
}

@Entity()
export class RouteUser implements RouteUserProps {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @IsLatitude()
    @Column({type: "float", nullable: false})
    endLatitude: number;

    @IsLongitude()
    @Column({type: "float", nullable: false})
    endLongitude: number;

    @IsLatitude()
    @Column({type: "float", nullable: false})
    startLatitude: number;

    @IsLongitude()
    @Column({type: "float", nullable: false})
    startLongitude: number;

    @Column({type : "float",nullable : false})
    distance : number;

    @IsDate()
    @IsDefined()
    @Column({nullable: false})
    startDate: Date;

    @IsDate()
    @IsDefined()
    @Column({nullable: false})
    endDate: Date;

    @ManyToOne(() => User, user => user.routesDone)
    user: User;

    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()
    updatedAt: Date;
    @DeleteDateColumn()
    deletedAt: Date;
}
