import { Model } from "mongoose";
import { Role, RoleModel } from "../models";

export class RoleService {

    readonly roleModel: Model<Role>;
    
    constructor() {
        this.roleModel = RoleModel;
    }

    async createRole(role: {name: string}): Promise<Role | null> {
        try {
            const createdRole = await this.roleModel.create({
                name: role.name
            });
            console.log(createdRole);
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

    async getRoleByName(name : string): Promise<Role | null> {
        try {
            const req = await this.roleModel.findOne({ name });
            return req;
        } catch (error: unknown) {
            return null;
        }
    }
}