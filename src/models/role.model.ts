import mongoose, { Document, Model, Schema } from "mongoose";

export interface Role extends Document {
  name: string;
  //permissions: string[];
}

const roleSchema: Schema = new Schema<Role>(
  {
    name: { type: Schema.Types.String, unique: true, required: true },
    //permissions: [{ type: Schema.Types.String, required: true }],
  },
  {
    collection: "roles",
    versionKey: false,
  }
);

export const RoleModel: Model<Role> = mongoose.model<Role>("Role", roleSchema);
