import { Request, Response, NextFunction } from "express";
import { ExpressUtils } from "../utils";

/* Enclosures */
export function validateUpdateByNameRequest(req: Request, res: Response, next: NextFunction): void {
    const name = req.params.name.trim().toLowerCase();
    if (!ExpressUtils.isValid(res, name, 'string', 2, 50)) {
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

/* Users */
export function validateCreateUser(req: Request, res: Response, next: NextFunction): void {
    const {
        login,
        password,
        role,
        active,
        workShift
    } = req.body;

    // Trim and lowercase some values and check if they are valid
    const trimmedLogin = login ? login.trim().toLowerCase() : undefined;
    const trimmedPassword = password ? password.trim() : undefined;
    const trimmedRole = role ? role.trim().toLowerCase() : undefined;
    const isDeclaredActive = active !== undefined ? active : true; // default: true if not declared
    const trimmedWorkShift = workShift.map((shift: {day: string, start: string, end: string}) => {
        return {
            day: shift.day.trim().toLowerCase(),
            start: shift.start.trim(),
            end: shift.end.trim()
        }
    }) as {day: string, start: string, end: string}[] | undefined;

    if (
        ExpressUtils.isValid(res, trimmedLogin, 'string', 4, 30) && 
        ExpressUtils.isValid(res, trimmedPassword, 'string', 8) &&
        trimmedRole && ExpressUtils.isValid(res, trimmedRole, 'string', 2, 30) &&
        ExpressUtils.isValid(res, isDeclaredActive, 'boolean') &&

        // Check if workShift is an array of 3 elements and if each element is valid
        trimmedWorkShift && ExpressUtils.isValid(res, trimmedWorkShift, 'array', 1, 7) &&
        trimmedWorkShift.every((shift: {day: string, start: string, end: string}) => {
            const validDaysOfWeek = /^(monday|tuesday|wednesday|thursday|friday|saturday|sunday)$/;
            const isValidDay = validDaysOfWeek.test(shift.day);
            
            return isValidDay &&
                ExpressUtils.isValid(res, shift.start, 'string', 5, 5) &&
                ExpressUtils.isValid(res, shift.end, 'string', 5, 5);
        })
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

export function validateUpdateUser(req: Request, res: Response, next: NextFunction): void {
    const login = req.params.login.trim().toLowerCase();
    if (!ExpressUtils.isValid(res, login, 'string', 4, 30)) {
        return;
    }

    const {
        password,
        role,
        active,
        workShift
    } = req.body;

    // Trim and lowercase some values and check if they are valid
    const trimmedPassword = password ? password.trim() : undefined;
    const trimmedRole = role ? role.trim().toLowerCase() : undefined;
    const isDeclaredActive = active !== undefined ? active : true; // default: true if not declared
    const trimmedWorkShift = workShift.map((shift: {day: string, start: string, end: string}) => {
        return {
            day: shift.day.trim().toLowerCase(),
            start: shift.start.trim(),
            end: shift.end.trim()
        }
    }) as {day: string, start: string, end: string}[] | undefined;

    if (
        (!password || (trimmedPassword && ExpressUtils.isValid(res, trimmedPassword, 'string', 8))) &&
        (!role || (trimmedRole && ExpressUtils.isValid(res, trimmedRole, 'string', 2, 30))) &&
        (!active || ExpressUtils.isValid(res, isDeclaredActive, 'boolean')) &&
        (!workShift || (trimmedWorkShift && ExpressUtils.isValid(res, trimmedWorkShift, 'array', 1, 7) &&
            trimmedWorkShift.every((shift: {day: string, start: string, end: string}) => {
                const validDaysOfWeek = /^(monday|tuesday|wednesday|thursday|friday|saturday|sunday)$/;
                const isValidDay = validDaysOfWeek.test(shift.day);
                
                return isValidDay &&
                    ExpressUtils.isValid(res, shift.start, 'string', 5, 5) &&
                    ExpressUtils.isValid(res, shift.end, 'string', 5, 5);
            })
        ))
    ) {
        next();
    } else {
        ExpressUtils.badRequest(res);
    }
}