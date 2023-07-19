import mongoose, { Document, Model, Schema } from "mongoose";

export interface Ticket extends Document {
  type: string; // PASS journée, PASS Week-end, PASS Annuel, PASS 1daymonth, PASS Night, PASS Escape game
  validEnclosures: Schema.Types.ObjectId[]; // List of enclosures that this ticket type can access
  escapeGameOrder: string[]; // Order of spaces to visit in the escape game
}

const TicketSchema: Schema = new Schema<Ticket>(
  {
    type: {
      type: Schema.Types.String,
      required: true,
    },
    validEnclosures: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Enclosure',
      },
    ],
    escapeGameOrder: [
      {
        type: Schema.Types.String,
      },
    ],
  },
  {
    collection: "tickets",
    versionKey: false,
  }
);

export const TicketModel: Model<Ticket> = mongoose.model<Ticket>("Ticket", TicketSchema);
