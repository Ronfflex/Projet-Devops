import { ExpressController } from "./controller.interface";
import { Request, Response, Router } from "express";
import * as express from "express";
import { EnclosureService } from "../services";
import { ExpressUtils } from "../utils";
import { validateCreateRequest, validateUpdateByNameRequest } from "../middlewares";

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


    /** [PATCH] **/
    /* Update enclosure by name */
    async updateByName(req: Request, res: Response): Promise<void> {
        const name = req.params.name.trim().toLowerCase();
    
        const {
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
    
        const updatedEnclosure = await this.enclosureService.updateEnclosureByName(name, {
            description,
            image,
            type,
            capacity,
            openingHours,
            duration,
            status,
            bestMaintenanceMonth,
            handicapAccessible
        });
    
        if (!updatedEnclosure) {
            return ExpressUtils.notFound(res);
        }
    
        res.json(updatedEnclosure);
    }



    /* Router */
    buildRoutes(): Router {
        const router = express.Router();
        router.get('/', this.getAll.bind(this));
        router.get('/id', this.getByName.bind(this));
        router.post('/create', express.json(), validateCreateRequest, this.create.bind(this));
        router.patch('/:name', express.json(), validateUpdateByNameRequest, this.updateByName.bind(this));
        return router;
    }
}