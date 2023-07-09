import { RequestHandler, NextFunction } from "express";
import { RoleService } from "../services";
import { ExpressUtils } from "../utils";

export function checkUpdatableRole(roleService: RoleService): RequestHandler {
  return async function (req, res, next: NextFunction) {
    const { name } = req.params;
    const trimmedName = name.trim().toLowerCase();

    if (!trimmedName || trimmedName.length < 3 || trimmedName.length > 20) {
      ExpressUtils.badRequest(res);
      return;
    }

    // Check if role we want to update exists
    const roleExists = await roleService.getRoleByName(trimmedName);
    if (!roleExists) {
      ExpressUtils.notFound(res);
      return;
    }
    // Check if role we want to update is updatable
    if (roleExists.updatable === false) {
      ExpressUtils.forbidden(res);
      return;
    }
    next();
  };
}
