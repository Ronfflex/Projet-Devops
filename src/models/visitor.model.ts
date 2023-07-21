import mongoose, { Document, Model, Schema } from "mongoose";

export interface Visitor extends Document {
  firstName: string;
  lastName: string;
  ticketId: Schema.Types.ObjectId;
  currentEnclosureId?: Schema.Types.ObjectId;
}

const VisitorSchema: Schema = new Schema<Visitor>(
  {
    firstName: {
      type: Schema.Types.String,
      required: true,
    },
    lastName: {
      type: Schema.Types.String,
      required: true,
    },
    ticketId: {
      type: Schema.Types.ObjectId,
      ref: 'Ticket',
      required: true,
    },
    currentEnclosureId: {
      type: Schema.Types.ObjectId,
      ref: 'Enclosure',
      required: false,
    },
  },
  {
    collection: "visitors",
    versionKey: false,
  }
);

export const VisitorModel: Model<Visitor> = mongoose.model<Visitor>("Visitor", VisitorSchema);
