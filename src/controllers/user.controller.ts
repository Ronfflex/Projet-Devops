import {ExpressController} from "./controller.interface";
import {Request, Response, Router} from 'express';
import * as express from "express";
import {AuthService} from "../services";
import {ExpressUtils} from "../utils";
import {checkAuthToken, validateCreateUser} from "../middlewares";
import { User } from "../models";
 
export class UserController implements ExpressController {

    readonly path: string;
    readonly authService: AuthService;

    constructor() {
        this.path = '/auth';
        this.authService = new AuthService();
    }

    /** [POST] **/
    /* Create a new user */
    async subscribe(req: Request, res: Response): Promise<void> {
        const {
            login,
            password,
            role,
            active
        } = req.body;

        // Trim and lowercase
        const trimmedLogin = login.trim().toLowerCase();
        const trimmedPassword = password.trim();
        const trimmedRole = role.trim().toLowerCase();

        const user = await this.authService.createUser({
            login: trimmedLogin,
            password: trimmedPassword,
            role: trimmedRole,
            active
        } as User);

        user ? res.json(user) : ExpressUtils.conflict(res);
    }

    /* Login */
    async login(req: Request, res: Response): Promise<void> {
        const user = await this.authService.findUser({
            login: req.body.login,
            password: req.body.password
        });

        if(!user) {
            return ExpressUtils.unauthorized(res);
        }
        
        const platform = req.headers['user-agent'];
        const session = await this.authService.startSession(user, platform);
        
        session ? res.json(session) : ExpressUtils.internalServerError(res);
    }

    /* Logout */
    async logout(req: Request, res: Response): Promise<void> {
        const authorization = req.headers.authorization;
        if(!authorization) {
            return ExpressUtils.unauthorized(res);
        }

        const parts = authorization.split(' ');
        const token = parts[1];
        if(!token) {
            return ExpressUtils.unauthorized(res);
        }

        const success = await this.authService.endSession(token);
        success ? res.status(200).json({message: 'Logout successful'}) : ExpressUtils.internalServerError(res);
    }


    /** [GET] **/
    /* Get current user */
    async me(req: Request, res: Response): Promise<void> {
        res.json(req.user);
    }

    /* Get all employees */
    async employees(req: Request, res: Response): Promise<void> {
        const employees = await this.authService.getAllEmployees();
        employees ? res.json(employees) : ExpressUtils.notFound(res);
    }


    /** [PUT] **/


    buildRoutes(): Router {
        const router = express.Router();
        router.post('/subscribe', express.json(), validateCreateUser, this.subscribe.bind(this));
        router.post('/login', express.json(), this.login.bind(this));
        router.post('/logout', checkAuthToken(), this.logout.bind(this));
        router.get('/me', checkAuthToken(), this.me.bind(this));
        router.get('/employees', checkAuthToken(), this.employees.bind(this));
        return router;
    }

}