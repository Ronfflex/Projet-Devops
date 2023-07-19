import mongoose, { Document, Model, Schema } from "mongoose";

export interface Role extends Document {
  name: string;
  updatable?: boolean;
}

const roleSchema: Schema = new Schema<Role>(
  {
    name: { type: Schema.Types.String, unique: true, required: true},
    updatable: { type: Schema.Types.Boolean, required: true, default: true, immutable: true },
  },
  {
    collection: "roles",
    versionKey: false,
  }
);

export const RoleModel: Model<Role> = mongoose.model<Role>("Role", roleSchema);
