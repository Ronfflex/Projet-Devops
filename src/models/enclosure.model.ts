import mongoose, {Model, Schema} from "mongoose";

export interface Enclosure {
    _id?: string;
    name: string;
    description: string;
    imageUrl: string;
    type: string; // e.g. "petting zoo", "aquarium", "aviary", "reptile house"
    capacity: number; // total people allowed
    actualCapacity: number; // current number of people
    openingHours: string;
    // closingHours: string;
    duration: number; // in minutes (e.g. 30 minutes)
    maintenance: boolean; // true if enclosure is closed for maintenance (no visitors allowed)
    handicapAccessible: boolean;
}

const enclosureSchema = new Schema<Enclosure>({
    name: {type: String, required: true, unique: true},
    description: {type: String, required: true},
    imageUrl: {type: String, required: true},
    type: {type: String, required: true},
    capacity: {type: Number, required: true},
    actualCapacity: {type: Number, required: true},
    openingHours: {type: String, required: true},
    // closingHours: {type: String, required: true},
    duration: {type: Number, required: true},
    maintenance: {type: Boolean, required: true},
    handicapAccessible: {type: Boolean, required: true},
}, {
    collection: "enclosures",
    versionKey: false,
});

export const EnclosureModel: Model<Enclosure> = mongoose.model("Enclosure", enclosureSchema);