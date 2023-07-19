import { Request, Response, Router } from "express";
import { StaffingService } from "../services/staffing.service";
import * as express from "express";
import { ExpressController } from "./controller.interface";
import { ExpressUtils } from "../utils";
import { checkAuthToken } from "../middlewares";


export class StaffingController implements ExpressController {
    readonly path: string;
    readonly staffingService: StaffingService;

    constructor() {
        this.path = "/staffing";
        this.staffingService = new StaffingService();
    }

    async getStaffing(req: Request, res: Response): Promise<void> {
        const isZooStaffed = await this.staffingService.isZooStaffed();

        // Return the current staffing status
        isZooStaffed ? res.status(200).json({ message: isZooStaffed }): ExpressUtils.internalServerError(res);
    };

    buildRoutes(): Router {
        const router = express.Router();
        router.get("/open", express.json(), checkAuthToken(), this.getStaffing.bind(this));
        return router;
    }
}