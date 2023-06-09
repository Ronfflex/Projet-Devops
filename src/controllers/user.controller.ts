import {ExpressController} from "./controller.interface";
import {Request, Response, Router} from 'express';
import * as express from "express";
import {AuthService} from "../services";
import {ExpressUtils} from "../utils";
import {checkAuthToken} from "../middlewares";

export class UserController implements ExpressController {

    readonly path: string;
    readonly authService: AuthService;

    constructor() {
        this.path = '/auth';
        this.authService = new AuthService();
    }

    async subscribe(req: Request, res: Response): Promise<void> {
        if(ExpressUtils.isString(res, req.body.login, 4, 30) &&
            ExpressUtils.isString(res, req.body.password, 8)) {
            const user = await this.authService.createUser({
                login: req.body.login,
                password: req.body.password,
                role: req.body.role,
                active: req.body.active
            });
            if(user) {
                res.json(user);
            } else {
                ExpressUtils.conflict(res);
            }
        }
    }

    async login(req: Request, res: Response): Promise<void> {
        if(ExpressUtils.isString(res, req.body.login, 4, 30) &&
            ExpressUtils.isString(res, req.body.password, 8)) {

            const user = await this.authService.findUser({
                login: req.body.login,
                password: req.body.password,
                role: req.body.role,
                active: req.body.active
            });
            if(!user) {
                return ExpressUtils.unauthorized(res);
            }
            const platform = req.headers['user-agent'];
            const session = await this.authService.startSession(user, platform);
            if(session) {
                res.json({
                    token: session._id
                });
            } else {
                ExpressUtils.internalServerError(res);
            }
        }
    }

    async me(req: Request, res: Response): Promise<void> {
        res.json(req.user);
    }

    buildRoutes(): Router {
        const router = express.Router();
        router.post('/subscribe', express.json(), this.subscribe.bind(this));
        router.post('/login', express.json(), this.login.bind(this));
        router.get('/me', checkAuthToken(), this.me.bind(this));
        return router;
    }

}