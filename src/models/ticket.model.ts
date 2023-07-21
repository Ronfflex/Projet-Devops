import mongoose, { Document, Model, Schema } from "mongoose";

export enum TicketType {
  DAY = "day",
  WEEKEND = "weekend",
  ANNUAL = "annual",
  ONE_DAY_PER_MONTH = "one_day_per_month",
  ESCAPE_GAME = "escape_game"
}

export interface Ticket extends Document {
  name: string;
  type: TicketType;
  validEnclosures: Schema.Types.ObjectId[];
  escapeGameOrder?: Schema.Types.ObjectId[];
  creationDate: Date;
  validity: Date;
}

const TicketSchema: Schema = new Schema<Ticket>(
  {
    name: {
      type: Schema.Types.String,
      required: true,
      unique: true,
    },
    type: {
      type: Schema.Types.String,
      enum: Object.values(TicketType),
      required: true,
    },
    validEnclosures: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Enclosure',
        required: true,
      },
    ],
    escapeGameOrder: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Enclosure',
      },
    ],
    creationDate: {
      type: Schema.Types.Date,
      required: true,
    },
    validity: {
      type: Schema.Types.Date,
      required: true,
    },
  },
  {
    collection: "tickets",
    versionKey: false,
  }
);

export const TicketModel: Model<Ticket> = mongoose.model<Ticket>("Ticket", TicketSchema);
