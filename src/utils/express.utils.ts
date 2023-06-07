import {Response} from "express";

export class ExpressUtils {

    static isValid(res: Response, value: unknown, type: string, min?: number, max?: number): boolean {
        switch(type) {
            case 'string':
                return this.isString(res, value, min, max, type);
            case 'number':
                return this.isNumber(res, value, min, max, type);
            case 'boolean':
                if(typeof value === 'boolean') return true;
                return this.badRequest(res, `Expected a boolean but received a ${typeof value}`);
            default:
                return this.badRequest(res, `Invalid type: ${type}`);
        }
    }

    static isString(res: Response, value: unknown, minLength?: number, maxLength?: number, field?: string): boolean {
        if(typeof value !== 'string') {
            return this.badRequest(res, `Expected ${field} to be a string but received a ${typeof value}`);
        }
        if(minLength !== undefined && value.length < minLength) {
            return this.badRequest(res, `${field} should be at least ${minLength} characters long`);
        }
        if(maxLength !== undefined && value.length > maxLength) {
            return this.badRequest(res, `${field} should be no more than ${maxLength} characters long`);
        }
        return true;
    }

    static isNumber(res: Response, value: unknown, min?: number, max?: number, field?: string): boolean {
        if(typeof value !== 'number') {
            return this.badRequest(res, `Expected ${field} to be a number but received a ${typeof value}`);
        }
        if(min !== undefined && value < min) {
            return this.badRequest(res, `${field} should be at least ${min}`);
        }
        if(max !== undefined && value > max) {
            return this.badRequest(res, `${field} should be no more than ${max}`);
        }
        return true;
    }

    static isImageUrlOrPath(value: string): boolean {
        return value.match(/^((http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png))|(([/|.|\w|\s|-])*\.(?:jpg|gif|png))$/
        ) !== null;
    }
    

    static badRequest(res: Response, message = 'Bad Request') {
        res.status(400).json({ error: message }).end();
        return false;
    }

    static unauthorized(res: Response) {
        res.status(401).end();
    }

    static notFound(res: Response) {
        res.status(404).end();
    }

    static conflict(res: Response) {
        res.status(409).end();
    }

    static internalServerError(res: Response) {
        res.status(500).end();
    }
}