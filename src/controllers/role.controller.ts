import { Request, Response, Router } from "express";
import { ExpressUtils } from "../utils";
import { ExpressController } from "./controller.interface";
import { RoleService } from "../services";
import * as express from "express";
import { checkAuthToken } from "../middlewares";

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

    if (!name && name.length < 3 && name.length > 20) {
      ExpressUtils.badRequest(res);
      return;
    }

    const role = await this.roleService.createRole({
      name: trimmedName
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

      if (!name && name.length < 3 && name.length > 20) {
        ExpressUtils.badRequest(res);
        return;
      }

      const role = await this.roleService.getRoleByName(trimmedName);
      role ? res.json(role) : ExpressUtils.notFound(res);
    }

  //   /** [PUT] **/
  //   /* Update role by name */
  //   async updateByName(req: Request, res: Response): Promise<void> {
  //     const { name } = req.params;
  //     const { name } = req.body;

  //     // Trim and lowercase all string values
  //     const trimmedName = name.trim().toLowerCase();

  //     const role = await this.roleService.updateRoleByName(name, {
  //       name: trimmedName,
  //     });

  //     role ? res.json(role) : ExpressUtils.notFound(res);
  //   }

  //   /** [DELETE] **/
  //   /* Delete role by name */
  //   async deleteByName(req: Request, res: Response): Promise<void> {
  //     const { name } = req.params;
  //     const trimmedName = name.trim().toLowerCase();
  //     const role = await this.roleService.deleteRoleByName(trimmedName);
  //     role ? res.json(role) : ExpressUtils.notFound(res);
  //   }

  //   /** [PATCH] **/
  //   /* Patch role by name */
  //   async patchByName(req: Request, res: Response): Promise<void> {
  //     const { name } = req.params;
  //     const { name } = req.body;

  //     // Trim and lowercase all string values
  //     const trimmedName = name.trim().toLowerCase();

  //     const role = await this.roleService.patchRoleByName(name, {
  //       name: trimmedName,
  //     });

  //     role ? res.json(role) : ExpressUtils.notFound(res);
  //   }

  /* Router */
  buildRoutes(): Router {
    const router = express.Router();
    router.post("/create", express.json(), this.create.bind(this));
    router.get("/", this.getAll.bind(this));
    router.get("/:name", this.getByName.bind(this));
    return router;
  }
}
