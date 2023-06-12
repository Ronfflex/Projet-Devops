import mongoose, { Document, Model, Schema } from 'mongoose';
import { UserCredentials } from './userCredentials.model';

const WorkShiftSchema: Schema = new Schema({
    day: {
        type: Schema.Types.String,
        required: true
    },
    start: {
        type: Schema.Types.String,
        required: true
    },
    end: {
        type: Schema.Types.String,
        required: true
    }
}, {
    _id: false
});

export interface User extends UserCredentials, Document {
    role: string;
    active: boolean;
    workShift: { day: string, start: string, end: string }[];
}

const userSchema: Schema = new Schema<User>({
    login: {type: Schema.Types.String, unique: true, required: true},
    password: {type: Schema.Types.String, required: true},
    role: {type: Schema.Types.String, required: true, default: "user"},
    active: {type: Schema.Types.Boolean, required: true, default: true},
    workShift: [WorkShiftSchema]
}, {
    collection: "users",
    versionKey: false
});

export const UserModel: Model<User> = mongoose.model<User>('User', userSchema);