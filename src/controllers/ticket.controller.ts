import { Request, Response, Router } from "express";
import { ExpressController } from "./controller.interface";
import { TicketService } from "../services/ticket.service";
import { ExpressUtils } from "../utils";
import * as express from "express";
import { EnclosureModel, TicketModel } from "../models";
import { checkAuthToken, checkRole } from "../middlewares";

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
        const { name, type, validEnclosures, escapeGameOrder, validity } = req.body;

        const trimmedName = name.trim().toLowerCase();
        const creationDate = new Date();

        if (!ExpressUtils.isValid(res, trimmedName, "string", 3, 60)) {
        ExpressUtils.badRequest(res);
        return;
        }

        if (!ExpressUtils.isValid(res, validity, "string", 4, 20)) {
        ExpressUtils.badRequest(res);
        return;
        }

        // Date validity (YYYY-MM-DD)
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(validity)) {
        ExpressUtils.badRequest(res);
        return;
        }

        // Loop through valid enclosures and verify if exists
        // for (const enclosureId of validEnclosures) {
        //     const enclosureExists = await EnclosureModel.findById(enclosureId);
        //     if (!enclosureExists) {
        //         ExpressUtils.badRequest(res);
        //         return;
        //     }
        // }


        const ticketExists = await TicketModel.findOne({ name: trimmedName });
        if (ticketExists) {
        return ExpressUtils.conflict(res);
        }

        const ticket = await this.ticketService.createTicket({
        name: trimmedName,
        type,
        validEnclosures,
        escapeGameOrder,
        creationDate,
        validity,
        });

        ticket ? res.json(ticket) : ExpressUtils.conflict(res);
    }

  /** [GET] **/
    /* Get all tickets */
    async getAll(req: Request, res: Response): Promise<void> {
        const tickets = await this.ticketService.getAllTickets();
        tickets ? res.json(tickets) : ExpressUtils.notFound(res);
    }

  buildRoutes(): Router {
    const router = Router();
    router.post("/buy", express.json(), this.create.bind(this));
    router.get("/", this.getAll.bind(this));
    return router;
  }
}