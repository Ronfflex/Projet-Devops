import { ExpressController } from "./controller.interface";
import { Request, Response, Router } from "express";
import * as express from "express";
import { MaintenanceService, EnclosureService } from "../services";
import { ExpressUtils } from "../utils";
import { checkAuthToken } from "../middlewares";

export class MaintenanceController implements ExpressController {

    readonly path: string;
    readonly maintenanceService: MaintenanceService;
    readonly enclosureService: EnclosureService;

    constructor() {
        this.path = "/maintenance";
        this.maintenanceService = new MaintenanceService();
        this.enclosureService = new EnclosureService();
    }

    /** GET **/
    /* Get maintenance by name */
    async getByName(req: Request, res: Response): Promise<void> {
        const name = req.params.name.trim().toLowerCase();
        if (!ExpressUtils.isValid(res, name, 'string', 2, 50)) {
            return;
        }
        // Verify if enclosure exist
        const enclosure = await this.enclosureService.getEnclosureByName(name);
        if (!enclosure) {
            ExpressUtils.notFound(res);
            return;
        }

        const maintenance = await this.maintenanceService.readMaintenanceByName(name);
        maintenance ? res.json(maintenance) : ExpressUtils.internalServerError(res);
    }

    /** POST **/
    /* Modify maintenance by name */
    async modifyByName(req: Request, res: Response): Promise<void> {
        const name = req.params.name.trim().toLowerCase();
        if (!ExpressUtils.isValid(res, name, 'string', 2, 50)) {
            return;
        }

        // Verify if enclosure exist
        const enclosure = await this.enclosureService.getEnclosureByName(name);
        if (!enclosure) {
            ExpressUtils.notFound(res);
            return;
        }

        if(!req.user){
            ExpressUtils.unauthorized(res);
            return;
        }
        const userLogin = req.user.login;
        const { comment } = req.body;
        const maintenance = await this.maintenanceService.modifyMaintenanceByName(name, comment, userLogin);
        maintenance ? res.json(maintenance) : ExpressUtils.internalServerError(res);
    }
    
    
    buildRoutes(): Router {
        const router = express.Router();
        router.get('/:name', checkAuthToken(), this.getByName.bind(this));
        router.post('/:name', express.json(), checkAuthToken(), this.modifyByName.bind(this));
        return router;
    }
}
