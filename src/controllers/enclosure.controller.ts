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

    /** [POST] **/
    /* Create enclosure */
    async create(req: Request, res: Response): Promise<void> {
        const {
            name,
            description,
            image,
            type,
            capacity,
            openingHours,
            duration,
            status,
            bestMaintenanceMonth,
            handicapAccessible
        } = req.body;
    
        // Trim and lowercase all string values
        const trimmedName = name.trim().toLowerCase();
        const trimmedDescription = description.trim();
        const trimmedImage = image.trim();
        const trimmedType = type.trim().toLowerCase();
        const trimmedOpeningHours = openingHours.trim();
    
        if (
            ExpressUtils.isValid(res, trimmedName, 'string', 2, 50) && 
            ExpressUtils.isValid(res, trimmedDescription, 'string', 0, 500) &&
            ExpressUtils.isImageUrlOrPath(trimmedImage) &&
            ExpressUtils.isValid(res, trimmedType, 'string', 2, 30) &&
            ExpressUtils.isValid(res, capacity, 'number', 1, 10000) &&
            ExpressUtils.isValid(res, trimmedOpeningHours, 'string', 11, 11) &&
            ExpressUtils.isValid(res, duration, 'number', 0, 1440) && 
            ExpressUtils.isValid(res, status, 'boolean') &&
            ExpressUtils.isValid(res, bestMaintenanceMonth, 'number', 1, 12) &&
            ExpressUtils.isValid(res, handicapAccessible, 'boolean')
        ) {
            const enclosure = await this.enclosureService.createEnclosure({
                name: trimmedName,
                description: trimmedDescription,
                image: trimmedImage,
                type: trimmedType,
                capacity,
                openingHours: trimmedOpeningHours,
                duration,
                status,
                bestMaintenanceMonth,
                handicapAccessible
            });
    
            enclosure ? res.json(enclosure) : ExpressUtils.conflict(res);
        } else {
            ExpressUtils.badRequest(res);
        }
    }
    

    /** [GET] **/
    /* Get all enclosures */
    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const enclosures = await this.enclosureService.getAllEnclosures();
            res.json(enclosures);
        } catch (error: unknown) {
            ExpressUtils.conflict(res);
        }
    }

    /* Get enclosure by name */
    async getByName(req: Request, res: Response): Promise<void> {
        const name = req.query.name as string;
        if (!ExpressUtils.isValid(res, name, 'string')) {
            return;
        }

        try {
            const enclosure = await this.enclosureService.getEnclosureByName(name);
            if(!enclosure) {
                return ExpressUtils.notFound(res);
            }
            res.json(enclosure);
        } catch (error: unknown) {
            ExpressUtils.conflict(res);
        }
    }


    /* Router */
    buildRoutes(): Router {
        const router = express.Router();
        router.get('/', this.getAll.bind(this));
        router.get('/getByName', this.getByName.bind(this));
        router.post('/create', express.json(), this.create.bind(this));
        return router;
    }
}