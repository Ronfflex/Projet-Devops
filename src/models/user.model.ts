import mongoose, {Model, Schema} from "mongoose";

export interface User {
    _id?: string;
    login: string; // unique
    password: string; // hashed
    role: string; // default: "user"
    active: boolean; // default: true
}

const userSchema = new Schema<User>({
    login: {type: Schema.Types.String, unique: true, required: true},
    password: {type: Schema.Types.String, required: true},
    role: {type: Schema.Types.String, required: true, default: "user"},
    active: {type: Schema.Types.Boolean, required: true, default: true}
}, {
    collection: "users",
    versionKey: false
});

export const UserModel: Model<User> = mongoose.model("User", userSchema);