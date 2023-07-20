import { Model } from "mongoose";
import { Ticket, TicketModel, EnclosureModel, TicketType } from "../models";


export class TicketService {
  readonly ticketModel: Model<Ticket>;

  constructor() {
    this.ticketModel = TicketModel;
  }

  async createTicket(ticket: { type: TicketType; validEnclosures: string[]; escapeGameOrder?: string[]; firstName: string; lastName: string; validity: Date; }): Promise<Ticket | null> {
    try {
      const createdTicket = await this.ticketModel.create({
        type: ticket.type,
        validEnclosures: ticket.validEnclosures,
        escapeGameOrder: ticket.escapeGameOrder,
        firstName: ticket.firstName,
        lastName: ticket.lastName,
        validity: ticket.validity,
      });
      return createdTicket;
    } catch (error: unknown) {
      return null;
    }
  }

  // async validateTicketAccess(ticketId: string, enclosureId: string): Promise<boolean> {
  //   try {
  //     // Find the ticket by id
  //     const ticket = await TicketModel.findById(ticketId);
  //     // Find the enclosure by id
  //     const enclosure = await EnclosureModel.findById(enclosureId);
  //   } catch (error: unknown) {
  //     return false;
  //   }

  //   // If the ticket type is escape game, check the order of access
  //   if (ticket.type === TicketType.ESCAPE_GAME) {
  //     if (ticket.escapeGameOrder && ticket.escapeGameOrder.length > 0) {
  //       const currentOrderIndex = ticket.escapeGameOrder.findIndex(orderEnclosure => orderEnclosure.toString() === enclosure._id);
  //       if (currentOrderIndex === -1) {
  //         return false;
  //       }
  //     } else {
  //       return false;
  //     }
  //   }

  //   // Check if the enclosure is in the valid enclosures of the ticket
  //   return ticket.validEnclosures.includes(enclosure._id);
  // }
}