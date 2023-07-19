import { ExpressController } from "./controller.interface";
import { Request, Response, Router } from "express";
import * as express from "express";
import { AuthService } from "../services";
import { ExpressUtils } from "../utils";
import {
  checkRole,
  checkAuthToken,
  validateCreateUser,
  validateUpdateUser,
  checkRoleOrSelf,
} from "../middlewares";
import { RoleModel, User } from "../models";

export class UserController implements ExpressController {
  readonly path: string;
  readonly authService: AuthService;

  constructor() {
    this.path = "/auth";
    this.authService = new AuthService();
  }

  /** [POST] **/
  /* Create a new user */
  async subscribe(req: Request, res: Response): Promise<void> {
    const { login, password, role, active, workShift } = req.body;

    // Trim and lowercase
    const trimmedLogin = login.trim().toLowerCase();
    const trimmedPassword = password.trim();
    const trimmedRole = role.trim().toLowerCase();
    const trimmedWorkShift = workShift.map(
      (shift: { day: string; start: string; end: string }) => {
        return {
          day: shift.day.trim().toLowerCase(),
          start: shift.start.trim(),
          end: shift.end.trim(),
        };
      }
    ) as { day: string; start: string; end: string }[];

    // Check if role exists
    const roleExists = await RoleModel.findOne({ name: trimmedRole });

    if (!roleExists) {
      return ExpressUtils.conflict(res);
    }

    const user = await this.authService.createUser({
      login: trimmedLogin,
      password: trimmedPassword,
      role: roleExists._id,
      active,
      workShift: trimmedWorkShift,
    } as User);

    user ? res.json(user) : ExpressUtils.conflict(res);
  }

  /* Login */
  async login(req: Request, res: Response): Promise<void> {
    // Check if user exists and password is correct
    const user = await this.authService.findUserLogin({
      login: req.body.login,
      password: req.body.password,
    });

    if (!user) {
      return ExpressUtils.unauthorized(res);
    }

    // Start session && populate user role
    const platform = req.headers["user-agent"];
    const session = await this.authService.startSession(user, platform);

    session ? res.json(session) : ExpressUtils.internalServerError(res);
  }

  /* Logout */
  async logout(req: Request, res: Response): Promise<void> {
    const authorization = req.headers.authorization;
    if (!authorization) {
      return ExpressUtils.unauthorized(res);
    }

    const parts = authorization.split(" ");
    const token = parts[1];
    if (!token) {
      return ExpressUtils.unauthorized(res);
    }

    const success = await this.authService.endSession(token);
    success
      ? res.status(200).json({ message: "Logout successful" })
      : ExpressUtils.internalServerError(res);
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

  /* Get all employees schledule */
  async employeesSchedule(req: Request, res: Response): Promise<void> {
    const employees = await this.authService.getAllEmployeesSchledule();
    employees ? res.json(employees) : ExpressUtils.notFound(res);
  }

  /** [PATCH] **/
  /* Update an employee */
  async updateByLogin(req: Request, res: Response): Promise<void> {
    const { login } = req.params;
    const { password, role, active, workShift } = req.body;
    const trimmedLogin = login.trim().toLowerCase();
    const trimmedRole = role.trim().toLowerCase();

    // Check if role exists
    const roleExists = await RoleModel.findOne({ name: trimmedRole });

    if (!roleExists) {
      return ExpressUtils.conflict(res);
    }

    // Check if the request is made by an admin or the user himself
    if (req.user?.role.name !== "admin" && req.user?.login !== trimmedLogin) {
      return ExpressUtils.unauthorized(res);
    }

    // Check if the request is made by an admin (to update active status et role)
    const isAdmin = req.user?.role.name === "admin";

    const updatedEmployee = await this.authService.updateEmployee(
      trimmedLogin,
      {
        password,
        role: roleExists._id,
        active,
        workShift,
      },
      isAdmin
    );

    updatedEmployee ? res.json(updatedEmployee) : ExpressUtils.notFound(res);
  }

  /** [DELETE] **/
  /* Delete an employee */
  async deleteByLogin(req: Request, res: Response): Promise<void> {
    const login = req.params.login.trim().toLowerCase();
    if (!ExpressUtils.isValid(res, login, "string", 4, 30)) {
      return;
    }

    const deletedUser = await this.authService.deleteUserByLogin(login);
    deletedUser ? ExpressUtils.noContent(res) : ExpressUtils.notFound(res);
  }

  buildRoutes(): Router {
    const router = express.Router();
    router.get("/me", checkAuthToken(), this.me.bind(this));
    router.get("/employees", checkAuthToken(), checkRole(['admin']), this.employees.bind(this));
    router.get("/employees/schledule", checkAuthToken(), this.employeesSchedule.bind(this));
    router.post("/subscribe", express.json(), validateCreateUser, this.subscribe.bind(this));
    router.post("/login", express.json(), this.login.bind(this));
    router.post("/logout", checkAuthToken(), this.logout.bind(this));
    router.patch("/employees/:login", express.json(), checkAuthToken(), checkRoleOrSelf(['admin']), validateUpdateUser, this.updateByLogin.bind(this));
    router.delete("/employees/:login", checkAuthToken(), checkRoleOrSelf(['admin']), this.deleteByLogin.bind(this));
    return router;
  }
}
