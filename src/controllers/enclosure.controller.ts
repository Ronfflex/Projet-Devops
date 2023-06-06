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
                imageUrl: req.body.imageUrl,
                type: req.body.type,
                capacity: req.body.capacity,
                actualCapacity: req.body.actualCapacity,
                openingHours: req.body.openingHours,
                // closingHours: req.body.closingHours,
                duration: req.body.duration,
                maintenance: req.body.maintenance,
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
        res.send("Get all enclosures " + this.path);
    }

    buildRoutes(): Router {
        const router = express.Router();
        router.get('/', this.getAll.bind(this));
        router.post('/create', express.json(), this.create.bind(this));
        return router;
    }
}