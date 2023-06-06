import {Response} from "express";

export class ExpressUtils {

    static isString(res: Response, value: unknown, minLength?: number, maxLength?: number): boolean {
        if(typeof value !== 'string') {
            this.badRequest(res);
            return false;
        }
        if(minLength !== undefined && value.length < minLength) {
            this.badRequest(res);
            return false;
        }
        if(maxLength !== undefined && value.length > maxLength) {
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

    static badRequest(res: Response) {
        res.status(400).end();
    }

    static conflict(res: Response) {
        res.status(409).end();
    }

    static unauthorized(res: Response) {
        res.status(401).end();
    }

    static internalServerError(res: Response) {
        res.status(500).end();
    }
}