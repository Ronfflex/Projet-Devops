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
        ExpressUtils.isValid(res, trimmedName, 'string', 2, 50) && 
        ExpressUtils.isValid(res, trimmedDescription, 'string', 0, 500) &&
        ExpressUtils.isImageUrlOrPath(trimmedImage) &&
        ExpressUtils.isValid(res, trimmedType, 'string', 2, 30) &&
        capacity && ExpressUtils.isValid(res, capacity, 'number', 1, 10000) &&
        ExpressUtils.isValid(res, trimmedOpeningHours, 'string', 11, 11) &&
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

export function validateCreateUser(req: Request, res: Response, next: NextFunction): void {
    const {
        login,
        password,
        role,
        active
    } = req.body;

    // Trim and lowercase some values and check if they are valid
    const trimmedLogin = login ? login.trim().toLowerCase() : undefined;
    const trimmedPassword = password ? password.trim() : undefined;
    const trimmedRole = role ? role.trim().toLowerCase() : undefined;
    const isDeclaredActive = active !== undefined ? active : true; // default: true if not declared

    if (
        ExpressUtils.isValid(res, trimmedLogin, 'string', 4, 30) && 
        ExpressUtils.isValid(res, trimmedPassword, 'string', 8) &&
        trimmedRole && ExpressUtils.isValid(res, trimmedRole, 'string', 2, 30) &&
        ExpressUtils.isValid(res, isDeclaredActive, 'boolean')
    ) {
        next();
    } else {
        ExpressUtils.badRequest(res);
    }
}

export function validateLoginUser(req: Request, res: Response, next: NextFunction): void {
    const {
        login,
        password
    } = req.body;

    // Trim and lowercase some values and check if they are valid
    const trimmedLogin = login ? login.trim().toLowerCase() : undefined;
    const trimmedPassword = password ? password.trim() : undefined;

    if (
        ExpressUtils.isValid(res, trimmedLogin, 'string', 4, 30) && 
        ExpressUtils.isValid(res, trimmedPassword, 'string', 8)
    ) {
        next();
    } else {
        ExpressUtils.badRequest(res);
    }
}