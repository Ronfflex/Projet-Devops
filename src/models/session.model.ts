import mongoose, {Model, Schema} from "mongoose";
import {User} from "./employee.model";

export interface Session {
    _id?: string;
    platform?: string;
    user: string | User;
}

const sessionSchema = new Schema<Session>({
    platform: {
        type: Schema.Types.String
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    collection: 'sessions',
    versionKey: false
});

export const SessionModel: Model<Session> = mongoose.model('Session', sessionSchema);
