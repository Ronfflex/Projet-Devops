import { Request, Response, Router } from "express";
import { VisitorService } from "../services";
import { ExpressController } from "./controller.interface";
import { ExpressUtils } from "../utils";
import express = require("express");
import { TicketModel } from "../models";
import { checkAuthToken, checkRole } from "../middlewares";

export class VisitorController implements ExpressController {
    readonly path: string;
    readonly visitorService: VisitorService;
    
    constructor() {
        this.path = "/visitor";
        this.visitorService = new VisitorService();
    }

    /** [POST] **/
    /* Create visitor */
    async create(req: Request, res: Response): Promise<void> {
        const { firstName, lastName, ticketName } = req.body;

        // Trim and lowercase all string values
        const trimmedFirstName = firstName.trim().toLowerCase();
        const trimmedLastName = lastName.trim().toLowerCase();
        const trimmedTicketName = ticketName.trim().toLowerCase();

        if (!ExpressUtils.isValid(res, trimmedTicketName, "string", 3, 60)) {
            ExpressUtils.badRequest(res);
            return;
        }
      
        if (!ExpressUtils.isValid(res, trimmedFirstName, "string", 2, 60)) {
            ExpressUtils.badRequest(res);
            return;
        }
      
        if (!ExpressUtils.isValid(res, trimmedLastName, "string", 2, 60)) {
            ExpressUtils.badRequest(res);
            return;
        }

        // Check if ticket exists
        const ticketExists = await TicketModel.findOne({ name: trimmedTicketName });

        if (!ticketExists) {
            return ExpressUtils.conflict(res);
        }

        const visitor = await this.visitorService.createVisitor({
            firstName: trimmedFirstName,
            lastName: trimmedLastName,
            ticketId: ticketExists._id,
        });

        visitor ? res.json(visitor) : ExpressUtils.conflict(res);
    }

    async accessEnclosure(req: Request, res: Response): Promise<void> {
        const { visitorId, enclosureId } = req.params;

        if (!ExpressUtils.isValid(res, visitorId, "string", 10, 60)) {
            ExpressUtils.badRequest(res);
            return;
        }

        if (!ExpressUtils.isValid(res, enclosureId, "string", 10, 60)) {
            ExpressUtils.badRequest(res);
            return;
        }

        const canAccess = await this.visitorService.canAccessEnclosure(visitorId, enclosureId);

        canAccess ? res.json({ canAccess }) : ExpressUtils.conflict(res);
    }


    buildRoutes(): Router {
        const router = Router();
        router.post("/create", express.json(), checkAuthToken(), checkRole(['admin']), this.create.bind(this));
        router.get("/access/:visitorId/:enclosureId", this.accessEnclosure.bind(this));
        return router;
    }
}