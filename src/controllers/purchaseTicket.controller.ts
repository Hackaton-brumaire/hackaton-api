import {DeleteResult, getRepository, Repository} from "typeorm";
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
                
                let availabilityDate = new Date((Date.now() + 60 * 60 * 24 * 31));

                const purchaseTicket = this.purchaseTicketRepository
                .create({user, availabilityDate});
                user.score = 0;
                await getRepository(User).save(user);

                return await this.purchaseTicketRepository.save(purchaseTicket);
            }
            else{
               throw "you already have an unused ticket";
            }
        }

        throw "your don't have enought Kilometers"
    }

    public async updateUseDate(ticketId: string, props: PurchaseTicketProps): Promise<DeleteResult>{
         await this.purchaseTicketRepository.save({
             id: ticketId,
             rechargeStationId: props.rechargeStationId
         })

        return await this.removeTicketWithTicketId(ticketId);
    }

    public async removeTicketWithTicketId(ticketId: string): Promise<DeleteResult>{
        const ticket = await this.purchaseTicketRepository.createQueryBuilder()
            .select()
            .leftJoinAndSelect("PurchaseTicket.user", "User")
            .getOne();

        const user = await getRepository(User).findOneOrFail(ticket.user.id);
        user.score = 0;
        await getRepository(User).save(user);

        return await this.purchaseTicketRepository.delete(ticketId);
    }

    public async removeTicket(userId: string, ticketId: string): Promise<DeleteResult>{
        const user = await getRepository(User).findOneOrFail(userId);

        user.score = 0;
        await getRepository(User).save(user);

        return await this.purchaseTicketRepository.softDelete(ticketId);
    }
}
