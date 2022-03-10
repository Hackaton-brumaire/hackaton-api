import {getRepository, Repository} from "typeorm";
import {PurchaseTicket, PurchaseTicketProps} from "../models/purchase_ticket.model";
import {Message, MessageProps} from "../models/message.model";
import {User} from "../models/user.model";
import {validate} from "class-validator";
import { use } from "passport";
import { userInfo } from "os";


export class PurchaseTicketController {
    private static instance: PurchaseTicketController;

    private purchaseTicketRepository: Repository<PurchaseTicket>;

    private constructor() {
        this.purchaseTicketRepository = getRepository(PurchaseTicket);
    }

    public static getInstance(): PurchaseTicketController {
        if (PurchaseTicketController.instance === undefined) {
            PurchaseTicketController.instance = new PurchaseTicketController();
        }

        return PurchaseTicketController.instance;
    }

    public async getRequestTicket(userId: string): Promise<{requestTicket: boolean, score: number}> {
        const user = await getRepository(User).findOneOrFail(userId);

        let data = {
            requestTicket: user.score === 100 && user.purchaseTickets.length === 0? true:false,
            score: user.score
        };

        return data;
    }

    public async updateTicket(userId: string, ticketId: string, props: PurchaseTicketProps): Promise<PurchaseTicket> {
        const user = await getRepository(User).findOneOrFail(userId);

        await this.purchaseTicketRepository.createQueryBuilder()
            .update()
            .set(props)
            .where("id=:ticket", {ticketId})
            .execute();

        return this.purchaseTicketRepository.findOneOrFail(ticketId);
    }

    public async updatetUserPoint(userId: string): Promise<PurchaseTicket> {
        let user: User = await getRepository(User).findOneOrFail(userId);
        const scoreForOneticket = 100;

        if(user.score === scoreForOneticket){
            if(user.purchaseTickets.length === 0){
                
                let availabilityDate = Date.now() + 60 * 60 * 24 * 31;
                let props: PurchaseTicketProps;
                props.user = user;
                props.availabilityDate = new Date(availabilityDate);  
                const purchaseTicket = this.purchaseTicketRepository
                .create(props);

                await getRepository(User).save(user);

                return await this.purchaseTicketRepository.save(purchaseTicket);
            }
            else{
               throw "you already have an unused ticket";
            }
        }

        throw "your don't have enought Kilometers"
    }

    public async updateUseDate(purchaseTicketId: string, props: PurchaseTicketProps): Promise<PurchaseTicket>{
        await this.purchaseTicketRepository.createQueryBuilder()
            .update()
            .set(props)
            .where("purchaseTicketId=:purchaseTicketId", {purchaseTicketId})
            .execute();

        return this.purchaseTicketRepository.findOneOrFail(purchaseTicketId);
    }

    public async removeTicket(userId: string, ticketId: string): Promise<void>{
        const user = await getRepository(User).findOneOrFail(userId);

        user.score = 0;
        await getRepository(User).save(user);

        await this.purchaseTicketRepository.delete(ticketId);
    }
}
