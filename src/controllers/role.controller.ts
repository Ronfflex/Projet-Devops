import { Request, Response, Router } from "express";
import { ExpressUtils } from "../utils";
import { ExpressController } from "./controller.interface";
import { RoleService } from "../services";
import * as express from "express";
import { checkAuthToken, checkRole, checkUpdatableRole } from "../middlewares";

export class RoleController implements ExpressController {
  readonly path: string;
  readonly roleService: RoleService;

  constructor() {
    this.path = "/role";
    this.roleService = new RoleService();
  }

  /** [POST] **/
  /* Create role */
  async create(req: Request, res: Response): Promise<void> {
    const { name } = req.body;

    // Trim and lowercase all string values
    const trimmedName = name.trim().toLowerCase();

    if (!name || name.length < 3 || name.length > 20) {
      ExpressUtils.badRequest(res);
      return;
    }

    const role = await this.roleService.createRole({
      name: trimmedName,
    });

    role ? res.json(role) : ExpressUtils.conflict(res);
  }

  /** [GET] **/
  /* Get all roles */
  async getAll(req: Request, res: Response): Promise<void> {
    const roles = await this.roleService.getAllRoles();
    roles ? res.json(roles) : ExpressUtils.notFound(res);
  }

  /* Get role by name */
  async getByName(req: Request, res: Response): Promise<void> {
    const { name } = req.params;
    const trimmedName = name.trim().toLowerCase();

    if (!name || name.length < 3 || name.length > 20) {
      ExpressUtils.badRequest(res);
      return;
    }

    const role = await this.roleService.getRoleByName(trimmedName);
    role ? res.json(role) : ExpressUtils.notFound(res);
  }

  /** [PATCH] **/
  /* Update role by name */
  async updateByName(req: Request, res: Response): Promise<void> {
    const { name } = req.params;
    const { newName } = req.body;

    const trimmedName = name.trim().toLowerCase();
    const trimmedNewName = newName.trim().toLowerCase();

    if (
      !trimmedNewName ||
      trimmedNewName.length < 3 ||
      trimmedNewName.length > 20
    ) {
      ExpressUtils.badRequest(res);
      return;
    }

    if (trimmedName === trimmedNewName) {
      ExpressUtils.badRequest(res);
      return;
    }

    // In the middleware, checking if role we want to update exists and is updatable

    const role = await this.roleService.updateRoleByName(trimmedName, {
      name: trimmedNewName,
    });

    /* If role is not found, it doesn't make sense because we already check that in the middleware.
    So it means another role already has the unique name we wanted to give (conflict). */
    role ? res.json(role) : ExpressUtils.conflict(res);
  }

  /** [DELETE] **/
  /* Delete role by name */
  async deleteByName(req: Request, res: Response): Promise<void> {
    const { name } = req.params;
    const trimmedName = name.trim().toLowerCase();

    if (!name || name.length < 3 || name.length > 20) {
      ExpressUtils.badRequest(res);
      return;
    }

    // In the middleware, checking if role we want to delete exists and is updatable
    const changeRole = await this.roleService.reassignUsers(trimmedName, 'user');
    if (changeRole === false) {
      ExpressUtils.notFound(res);
      return;
    } else if (changeRole === null) {
      ExpressUtils.internalServerError(res);
      return;
    }

    const role = await this.roleService.deleteRoleByName(trimmedName);
    role ? res.json() : ExpressUtils.notFound(res);
  }

  /* Router */
  buildRoutes(): Router {
    const router = express.Router();
    router.post("/create", express.json(), checkAuthToken(), checkRole(['admin']), this.create.bind(this));
    router.get("/", checkAuthToken(), this.getAll.bind(this));
    router.get("/:name", checkAuthToken(), this.getByName.bind(this));
    router.patch("/:name", express.json(), checkAuthToken(), checkRole(['admin']), checkUpdatableRole(this.roleService), this.updateByName.bind(this));
    router.delete("/:name", checkAuthToken(), checkRole(['admin']), checkUpdatableRole(this.roleService), this.deleteByName.bind(this));
    return router;
  }
}
