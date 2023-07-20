import { Request, Response, Router } from "express";
import { ExpressController } from "./controller.interface";
import { TicketService } from "../services/ticket.service";
import { ExpressUtils } from "../utils";
import * as express from "express";

export class TicketController implements ExpressController {
    readonly path: string;
    readonly ticketService: TicketService;

    constructor() {
        this.path = "/ticket";
        this.ticketService = new TicketService();
    }

    /** [POST] **/
    /* Create ticket */
    async create(req: Request, res: Response): Promise<void> {
        const { type, validEnclosures, escapeGameOrder, firstName, lastName, validity } = req.body;

        // Trim and lowercase all string values
        const trimmedFirstName = firstName.trim().toLowerCase();
        const trimmedLastName = lastName.trim().toLowerCase();

        if (!type || !validEnclosures || !firstName || !lastName || !validity) {
            ExpressUtils.badRequest(res);
            return;
        }

        const ticket = await this.ticketService.createTicket({
            type,
            validEnclosures,
            escapeGameOrder,
            firstName: trimmedFirstName,
            lastName: trimmedLastName,
            validity,
        });

        ticket ? res.json(ticket) : ExpressUtils.conflict(res);
    }


    buildRoutes(): Router {
        const router = Router();
        router.post("/buy", express.json(), this.create.bind(this));
        return router;
    }
}