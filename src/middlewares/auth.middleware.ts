import {Request, RequestHandler} from "express";
import {ExpressUtils} from "../utils";
import {AuthService} from "../services";
import {User} from "../models";

declare module 'express' {
    export interface Request {
        user?: User;
    }
}

export function checkAuthToken(): RequestHandler {
    return async function(req: Request, res, next) {
        const authorization = req.headers['authorization'];
        if(authorization === undefined) {
            return ExpressUtils.unauthorized(res);
        }
        const parts = authorization.split(' ');
        if(parts.length !== 2 || parts[0] !== 'Bearer') {
            return ExpressUtils.unauthorized(res);
        }
        const token = parts[1];
        const authService = new AuthService();
        const session = await authService.findSession(token);
        if(!session) {
            return ExpressUtils.unauthorized(res);
        }
        // Store user logged in the request object for later use in the controller
        req.user = session.user as User;
        next();
    };
}

export function checkRole(roles: string[]): RequestHandler {
    return async function(req: Request, res, next) {
        const user = req.user;
        if(user === undefined) {
            return ExpressUtils.unauthorized(res);
        }
        if(!roles.includes(user.role.name)) {
            return ExpressUtils.forbidden(res);
        }
        next();
    };
}

export function checkRoleOrSelf(roles: string[]): RequestHandler {
    return async function(req: Request, res, next) {
        const user = req.user;
        const userLoginParam = req.params.login.trim().toLowerCase();
        
        if(user === undefined) {
            return ExpressUtils.unauthorized(res);
        }

        if(!roles.includes(user.role.name) && user.login !== userLoginParam) {
            return ExpressUtils.forbidden(res);
        }
        next();
    };
}
