import mongoose, { Document, Model, Schema } from "mongoose";

export interface Zoo extends Document {
  name: string;
  openingTime: string; // Format: "HH:MM"
  closingTime: string; 
  isOpenNight: boolean;
}

const ZooSchema: Schema = new Schema<Zoo>(
  {
    name: {
      type: Schema.Types.String,
      unique: true,
      required: true,
    },
    openingTime: {
      type: Schema.Types.String,
      required: true,
    },
    closingTime: {
      type: Schema.Types.String,
      required: true,
    },
    isOpenNight: {
      type: Schema.Types.Boolean,
      default: false,
    }
  },
  {
    collection: "zoo",
    versionKey: false,
  }
);

export const ZooModel: Model<Zoo> = mongoose.model<Zoo>("Zoo", ZooSchema);
