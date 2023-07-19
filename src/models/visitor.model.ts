import mongoose, { Document, Model, Schema } from "mongoose";

export interface Visitor extends Document {
  ticketId: Schema.Types.ObjectId; // Reference to the ticket model
  currentEnclosureId: Schema.Types.ObjectId; // The current Enclosure the visitor is in
}

const VisitorSchema: Schema = new Schema<Visitor>(
  {
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
