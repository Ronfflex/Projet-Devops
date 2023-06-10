import {Model, isValidObjectId} from "mongoose";
import {Session, SessionModel, User, UserModel, UserCredentials} from "../models";
import {SecurityUtils} from "../utils";

export class AuthService {

    readonly userModel: Model<User>;
    readonly sessionModel: Model<Session>;

    constructor() {
        this.userModel = UserModel;
        this.sessionModel = SessionModel;
    }

    async createUser(user: User): Promise<User | null> {
        try {
            const createdUser = await this.userModel.create({
                login: user.login,
                password: SecurityUtils.toSHA512(user.password),
                role: user.role,
                active: user.active
            });
            return createdUser;
        } catch(err: unknown) {
            return null;
        }
    }

    async findUser(credentials: UserCredentials): Promise<User | null> {
        try {
            const req = await this.userModel.findOne({
                login: credentials.login,
                password: SecurityUtils.toSHA512(credentials.password)
            }).exec();
            return req;
        } catch (err: unknown) {
            return null;
        }
    }

    async startSession(user: User, platform?: string): Promise<Session | null> {
        try {
            const session = await this.sessionModel.create({
                platform,
                user: user._id
            });
            return session;
        } catch (err: unknown) {
            return null;
        }
    }

    async endSession(token: string): Promise<boolean> {
        try {
            const session = await this.sessionModel.findByIdAndDelete(token).exec();
            if(!session) {
                return false;
            }
            return true;
        } catch (err: unknown) {
            return false;
        }
    }

    async findSession(token: string): Promise<Session | null> {
        if(!isValidObjectId(token)) {
            return null;
        }
        const session = await this.sessionModel.findById(token).populate('user').exec();
        return session;
    }

    async getAllEmployees(): Promise<User[] | null> {
        try {
            const employees = await this.userModel.find();
            return employees;
        } catch (error: unknown) {
            return null;
        }
    }
}