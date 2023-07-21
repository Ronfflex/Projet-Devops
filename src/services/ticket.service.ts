import { Model } from "mongoose";
import { Ticket, TicketModel, EnclosureModel, TicketType } from "../models";


export class TicketService {
  readonly ticketModel: Model<Ticket>;

  constructor() {
    this.ticketModel = TicketModel;
  }

  async createTicket(ticket: { name: string, type: TicketType; validEnclosures: string[]; escapeGameOrder?: string[]; creationDate: Date, validity: Date; }): Promise<Ticket | null> {
    try {
      const createdTicket = await this.ticketModel.create({
        name: ticket.name,
        type: ticket.type,
        validEnclosures: ticket.validEnclosures,
        escapeGameOrder: ticket.escapeGameOrder,
        creationDate: ticket.creationDate,
        validity: ticket.validity,
      });
      return createdTicket;
    } catch (error: unknown) {
      console.log(error);
      return null;
    }
  }

  async getAllTickets(): Promise<Ticket[] | null> {
    try {
      const tickets = await this.ticketModel.find();
      return tickets;
    } catch (error: unknown) {
      console.log(error);
      return null;
    }
  }
}