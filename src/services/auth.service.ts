import {Model, isValidObjectId} from "mongoose";
import {Session, SessionModel, User, UserModel} from "../models";
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
                password: SecurityUtils.toSHA512(user.password)
            });
            return createdUser;
        } catch(err: unknown) {
            return null;
        }
    }

    async findUser(user: User): Promise<User | null> {
        const u = await this.userModel.findOne({
            login: user.login,
            password: SecurityUtils.toSHA512(user.password)
        }).exec();
        return u;
    }

    async startSession(user: User, platform?: string): Promise<Session | null> {
        const session = await this.sessionModel.create({
            platform,
            user: user._id
        });
        return session;
    }

    async findSession(token: string): Promise<Session | null> {
        if(!isValidObjectId(token)) {
            return null;
        }
        const session = await this.sessionModel.findById(token).populate('user').exec();
        return session;
    }
}