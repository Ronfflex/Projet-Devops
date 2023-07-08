import { Model } from "mongoose";
import { Role, RoleModel, UserModel } from "../models";

export class RoleService {
  readonly roleModel: Model<Role>;

  constructor() {
    this.roleModel = RoleModel;
  }

  async createRole(role: { name: string }): Promise<Role | null> {
    try {
      const createdRole = await this.roleModel.create({
        name: role.name,
      });
      return createdRole;
    } catch (error: unknown) {
      return null;
    }
  }

  async getAllRoles(): Promise<Role[] | null> {
    try {
      const roles = await this.roleModel.find();
      return roles;
    } catch (error: unknown) {
      return null;
    }
  }

  async getRoleByName(name: string): Promise<Role | null> {
    try {
      const req = await this.roleModel.findOne({ name });
      return req;
    } catch (error: unknown) {
      return null;
    }
  }

  async updateRoleByName(
    name: string,
    updateData: Partial<Role>
  ): Promise<Role | null> {
    try {
      const updatedRole = await this.roleModel.findOneAndUpdate(
        { name },
        updateData,
        { new: true }
      );
      return updatedRole;
    } catch (error: unknown) {
      return null;
    }
  }

  async deleteRoleByName(name: string): Promise<boolean | null> {
    try {
      const deletedRole = await this.roleModel.findOneAndDelete({ name });
      return deletedRole ? true : false;
    } catch (error: unknown) {
      return null;
    }
  }

  async reassignUsers(oldRoleName: string, newRoleName: string): Promise<boolean | null> {
    try {
      const oldRole = await this.roleModel.findOne({ name: oldRoleName });
      const newRole = await this.roleModel.findOne({ name: newRoleName });

      if (oldRole && newRole) {
        await UserModel.updateMany(
          { role: oldRole._id },
          { role: newRole._id }
        );
        return true;
      } else {
        return false;
      }
    } catch (error: unknown) {
      return null;
    }
  }
}
