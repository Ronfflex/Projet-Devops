import { ExpressController } from "./controller.interface";
import { Request, Response, Router } from "express";
import * as express from "express";
import { EnclosureService } from "../services";
import { ExpressUtils } from "../utils";

export class EnclosureController implements ExpressController {

    readonly path: string;
    readonly enclosureService: EnclosureService;

    constructor() {
        this.path = "/enclosure";
        this.enclosureService = new EnclosureService();
    }

    async create(req: Request, res: Response): Promise<void> {
        if(ExpressUtils.isString(res, req.body.name, 4, 30)) { // Make more checks
            const enclosure = await this.enclosureService.createEnclosure({
                name: req.body.name,
                description: req.body.description,
                image: req.body.image,
                type: req.body.type,
                capacity: req.body.capacity,
                openingHours: req.body.openingHours,
                duration: req.body.duration,
                status: req.body.status,
                bestMaintenanceMonth: req.body.bestMaintenanceMonth,
                handicapAccessible: req.body.handicapAccessible
            });
            if(enclosure) {
                res.json(enclosure);
            } else {
                ExpressUtils.conflict(res);
            }
        }
    }

    async getAll(req: Request, res: Response): Promise<void> {
        const enclosures = await this.enclosureService.getAllEnclosures();
        res.json(enclosures);
    }

    buildRoutes(): Router {
        const router = express.Router();
        router.get('/', this.getAll.bind(this));
        router.post('/create', express.json(), this.create.bind(this));
        return router;
    }
}