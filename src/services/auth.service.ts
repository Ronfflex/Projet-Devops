import { Model, isValidObjectId } from "mongoose";
import {
  Session,
  SessionModel,
  User,
  UserModel,
  UserCredentials,
  Role,
  RoleModel,
} from "../models";
import { SecurityUtils } from "../utils";

export class AuthService {
  readonly userModel: Model<User>;
  readonly sessionModel: Model<Session>;
  readonly roleModel: Model<Role>;

  constructor() {
    this.userModel = UserModel;
    this.sessionModel = SessionModel;
    this.roleModel = RoleModel;
  }

  async createUser(user: User): Promise<User | null> {
    try {
      const createdUser = await this.userModel.create({
        login: user.login,
        password: SecurityUtils.toSHA512(user.password),
        role: user.role,
        active: user.active,
        workShift: user.workShift,
      });
      return createdUser;
    } catch (err: unknown) {
      return null;
    }
  }

  async findUserLogin(credentials: UserCredentials): Promise<User | null> {
    try {
      const req = await this.userModel
        .findOne({
          login: credentials.login,
          password: SecurityUtils.toSHA512(credentials.password),
        })
        .exec();
      return req;
    } catch (err: unknown) {
      return null;
    }
  }

  async startSession(user: User, platform?: string): Promise<Session | null> {
    try {
      // Create a new session
      let session = await this.sessionModel.create({
        platform,
        user: user._id,
      });
      session = await session.populate('user');
      return session;
    } catch (err: unknown) {
      return null;
    }
  }

  async endSession(token: string): Promise<boolean> {
    try {
      const session = await this.sessionModel.findByIdAndDelete(token).exec();
      if (!session) {
        return false;
      }
      return true;
    } catch (err: unknown) {
      return false;
    }
  }

  async findSession(token: string): Promise<Session | null> {
    if (!isValidObjectId(token)) {
      return null;
    }
    const session = await this.sessionModel
      .findById(token)
      .populate({ path: "user", populate: { path: "role", model: "Role" } })
      .exec();
    return session;
  }

  async getAllEmployees(): Promise<User[] | null> {
    try {
      const employees = await this.userModel.find().populate("role");
      return employees;
    } catch (error: unknown) {
      return null;
    }
  }

  async getAllEmployeesSchledule(): Promise<User[] | null> {
    try {
      const employees = await this.userModel.find(
        {},
        { role: 1, workShift: 1 }
      );
      return employees;
    } catch (error: unknown) {
      return null;
    }
  }

  async updateEmployee(userLogin: string, updateFields: Partial<User>, isAdmin: boolean): Promise<User | null> {
    // Remove _id and login fields if present
    const { _id, login, ...filteredUpdateFields } = updateFields;

    // Hash password if it is present
    if (filteredUpdateFields.password) {
      filteredUpdateFields.password = SecurityUtils.toSHA512(
        filteredUpdateFields.password
      );
    }

    // Remove role and active fields if the user is not admin
    if(!isAdmin && 'role' in filteredUpdateFields) {
      delete filteredUpdateFields.role;
    }
    if(!isAdmin && 'active' in filteredUpdateFields) {
      delete filteredUpdateFields.active;
    }

    const updatedEmployee: User | null = await UserModel.findOneAndUpdate(
      { login: userLogin },
      { $set: filteredUpdateFields },
      { new: true }
    ).populate("role");

    return updatedEmployee;
  }

  async deleteUserByLogin(login: string): Promise<boolean | null> {
    try {
      const user = await this.userModel.findOne({ login });
      if (!user) {
        return false;
      }

      // End all sessions of the user
      await this.sessionModel.deleteMany({ user: user._id });

      // Delete the user
      const deletedUser = await this.userModel.findOneAndDelete({ login });
      return deletedUser ? true : false;
    } catch (error: unknown) {
      return null;
    }
  }
}
