import {Response} from "express";

export class ExpressUtils {

    static isValid(res: Response, value: unknown, type: string, min?: number, max?: number): boolean {
        switch(type) {
            case 'string':
                return this.isString(res, value, min, max);
            case 'number':
                return this.isNumber(res, value, min, max);
            case 'boolean':
                return typeof value === 'boolean' || this.badRequest(res);
            case 'array':
                return this.isArrayOfStrings(res, value, min, max);
            default:
                return this.badRequest(res);
        }
    }

    static isString(res: Response, value: unknown, minLength?: number, maxLength?: number): boolean {
        if(typeof value !== 'string') {
            console.log('string');
            this.badRequest(res);
            return false;
        }
        if(minLength !== undefined && value.length < minLength) {
            console.log('minLengthString');
            this.badRequest(res);
            return false;
        }
        if(maxLength !== undefined && value.length > maxLength) {
            console.log('maxLengthString');
            this.badRequest(res);
            return false;
        }
        return true;
    }

    static isNumber(res: Response, value: unknown, min?: number, max?: number): boolean {
        if(typeof value !== 'number') {
            this.badRequest(res);
            return false;
        }
        if(min !== undefined && value < min) {
            this.badRequest(res);
            return false;
        }
        if(max !== undefined && value > max) {
            this.badRequest(res);
            return false;
        }
        return true;
    }

    static isArrayOfStrings(res: Response, value: unknown, minLength?: number, maxLength?: number): boolean {
        if(!Array.isArray(value)) {
            console.log('array');
            this.badRequest(res);
            return false;
        }
        if(minLength !== undefined && value.length < minLength) {
            console.log('minLength');
            this.badRequest(res);
            return false;
        }
        if(maxLength !== undefined && value.length > maxLength) {
            console.log('maxLength');
            this.badRequest(res);
            return false;
        }
        return true;
    }

    static isImageUrlOrPath(value: string): boolean {
        return value.match(/^((http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png))|(([/|.|\w|\s|-])*\.(?:jpg|gif|png))$/
        ) !== null;
    }

    /* 2xx Success */
    static noContent(res: Response) {
        res.status(204).end();
    }

    static created(res: Response, data?: unknown) {
        res.status(201).json(data);
    }
    
    /* 4xx Client errors */
    static badRequest(res: Response) {
        res.status(400).end();
        return false;
    }

    static unauthorized(res: Response) {
        res.status(401).end();
    }

    static forbidden(res: Response) {
        res.status(403).end();
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