import { ExpressController } from "./controller.interface";
import { Request, Response, Router } from "express";
import * as express from "express";
import { EnclosureService } from "../services";
import { ExpressUtils } from "../utils";
import { checkAuthToken, checkRole, validateCreateRequest, validateUpdateByNameRequest } from "../middlewares";

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

        const animals:string[] = []
    
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
            handicapAccessible,
            animals
        });
    
        enclosure ? res.json(enclosure) : ExpressUtils.conflict(res);
    }
    

    /** [GET] **/
    /* Get all enclosures */
    async getAll(req: Request, res: Response): Promise<void> {    
        const enclosures = await this.enclosureService.getAllEnclosures();
        enclosures ? res.json(enclosures) : ExpressUtils.notFound(res);
    }

    /* Get enclosure by name */
    async getByName(req: Request, res: Response): Promise<void> {
        if (typeof req.query.name === 'string') {
            const name = req.query.name.trim().toLowerCase();
    
            if (!ExpressUtils.isValid(res, name, 'string', 2, 50)) {
                return;
            }
    
            const enclosure = await this.enclosureService.getEnclosureByName(name);
            enclosure ? res.json(enclosure) : ExpressUtils.notFound(res);
        } else {
            ExpressUtils.badRequest(res);
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
    
        updatedEnclosure ? res.json(updatedEnclosure) : ExpressUtils.notFound(res);
    }

    /* Set maintenance by name */
    async setMaintenance(req: Request, res: Response): Promise<void> {
        const name = req.params.name.trim().toLowerCase();
        const { status } = req.body;

        if (!ExpressUtils.isValid(res, name, 'string', 2, 50)) {
            return;
        }

        if (!ExpressUtils.isValid(res, status, 'boolean')) {
            return;
        }

        const updatedEnclosure = await this.enclosureService.setMaintenance(name, status);
        updatedEnclosure ? res.json(updatedEnclosure) : ExpressUtils.notFound(res);
    }


    /** [DELETE] **/
    /* Delete enclosure by name */
    async deleteByName(req: Request, res: Response): Promise<void> {
        const name = req.params.name.trim().toLowerCase();
        if (!ExpressUtils.isValid(res, name, 'string', 2, 50)) {
            return;
        }
        
        const deletedEnclosure = await this.enclosureService.deleteEnclosureByName(name);
        deletedEnclosure ? ExpressUtils.noContent(res) : ExpressUtils.notFound(res);
    }



    /* Router */
    buildRoutes(): Router {
        const router = express.Router();
        router.get('/', checkAuthToken(), this.getAll.bind(this));
        router.get('/id', checkAuthToken(), this.getByName.bind(this));
        router.post('/create', express.json(), checkAuthToken(), checkRole(['admin']), validateCreateRequest, this.create.bind(this));
        router.patch('/:name', express.json(), checkAuthToken(), checkRole(['admin']), validateUpdateByNameRequest, this.updateByName.bind(this));
        router.patch('/:name/maintenance', express.json(), checkAuthToken(), checkRole(['admin']), this.setMaintenance.bind(this));
        router.delete('/:name', checkAuthToken(), checkRole(['admin']), this.deleteByName.bind(this));
        return router;
    }
}