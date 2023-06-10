import mongoose, { Document, Model, Schema } from 'mongoose';
import { UserCredentials } from './userCredentials.model';

export interface User extends UserCredentials, Document {
    role: string;
    active: boolean;
}

const userSchema: Schema = new Schema<User>({
    login: {type: Schema.Types.String, unique: true, required: true},
    password: {type: Schema.Types.String, required: true},
    role: {type: Schema.Types.String, required: true, default: "user"},
    active: {type: Schema.Types.Boolean, required: true, default: true}
}, {
    collection: "users",
    versionKey: false
});

export const UserModel: Model<User> = mongoose.model<User>('User', userSchema);