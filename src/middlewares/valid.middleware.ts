import { Request, Response, NextFunction } from "express";
import { ExpressUtils } from "../utils";

export function validateUpdateByNameRequest(req: Request, res: Response, next: NextFunction): void {
    const name = req.params.name.trim().toLowerCase();
    if (!ExpressUtils.isValid(res, name, 'string')) {
        return;
    }

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

    // Trim and lowercase all string values and check if they are valid
    const trimmedDescription = description ? description.trim() : undefined;
    const trimmedImage = image ? image.trim() : undefined;
    const trimmedType = type ? type.trim().toLowerCase() : undefined;
    const trimmedOpeningHours = openingHours ? openingHours.trim() : undefined;

    if (
        (!description || ExpressUtils.isValid(res, trimmedDescription, 'string', 0, 500)) &&
        (!image || ExpressUtils.isImageUrlOrPath(trimmedImage)) &&
        (!type || ExpressUtils.isValid(res, trimmedType, 'string', 2, 30)) &&
        (!capacity || ExpressUtils.isValid(res, capacity, 'number', 1, 10000)) &&
        (!openingHours || ExpressUtils.isValid(res, trimmedOpeningHours, 'string', 11, 11)) &&
        (!duration || ExpressUtils.isValid(res, duration, 'number', 0, 1440)) && 
        (status === undefined || ExpressUtils.isValid(res, status, 'boolean')) &&
        (!bestMaintenanceMonth || ExpressUtils.isValid(res, bestMaintenanceMonth, 'number', 1, 12)) &&
        (handicapAccessible === undefined || ExpressUtils.isValid(res, handicapAccessible, 'boolean'))
    ) {
        next();
    } else {
        ExpressUtils.badRequest(res);
    }
}

export function validateCreateRequest(req: Request, res: Response, next: NextFunction): void {
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

    // Trim and lowercase all string values and check if they are valid
    const trimmedName = name ? name.trim().toLowerCase() : undefined;
    const trimmedDescription = description ? description.trim() : undefined;
    const trimmedImage = image ? image.trim() : undefined;
    const trimmedType = type ? type.trim().toLowerCase() : undefined;
    const trimmedOpeningHours = openingHours ? openingHours.trim() : undefined;

    if (
        trimmedName && ExpressUtils.isValid(res, trimmedName, 'string', 2, 50) && 
        trimmedDescription && ExpressUtils.isValid(res, trimmedDescription, 'string', 0, 500) &&
        trimmedImage && ExpressUtils.isImageUrlOrPath(trimmedImage) &&
        trimmedType && ExpressUtils.isValid(res, trimmedType, 'string', 2, 30) &&
        capacity && ExpressUtils.isValid(res, capacity, 'number', 1, 10000) &&
        trimmedOpeningHours && ExpressUtils.isValid(res, trimmedOpeningHours, 'string', 11, 11) &&
        duration && ExpressUtils.isValid(res, duration, 'number', 0, 1440) && 
        status !== undefined && ExpressUtils.isValid(res, status, 'boolean') &&
        handicapAccessible !== undefined && ExpressUtils.isValid(res, handicapAccessible, 'boolean') &&
        (!bestMaintenanceMonth || ExpressUtils.isValid(res, bestMaintenanceMonth, 'number', 1, 12))
    ) {
        next();
    } else {
        ExpressUtils.badRequest(res);
    }
}