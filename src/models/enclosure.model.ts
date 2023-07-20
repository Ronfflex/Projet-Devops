import mongoose, {Model, Schema} from "mongoose";
import { Animal } from "./animal.model";

export interface Enclosure {
    _id?: string;
    name: string;
    description: string;
    image: string; // URL or path to image
    type: string; // e.g. "petting zoo", "aquarium", "aviary", "reptile house"
    capacity: number; // total people allowed
    openingHours: string; // "09:00-17:00"
    duration: number; // how long somoene can stay in this space, in minutes (e.g. 30 minutes)
    status: boolean; // true if enclosure is closed for maintenance (no visitors allowed)
    bestMaintenanceMonth?: number; // 1-12
    handicapAccessible: boolean;
    animals: string[]|Animal[]
}

const enclosureSchema = new Schema<Enclosure>({
    name: {type: String, required: true, unique: true},
    description: {type: String, required: true},
    image: {type: String, required: true},
    type: {type: String, required: true},
    capacity: {type: Number, required: true},
    openingHours: {type: String, required: true},
    duration: {type: Number, required: true},
    status: {type: Boolean, required: true},
    bestMaintenanceMonth: {type: Number, required: false},
    handicapAccessible: {type: Boolean, required: true},
    animals: [{type: Schema.Types.ObjectId, ref:'Animal'}]
}, {
    collection: "enclosures",
    versionKey: false,
});

export const EnclosureModel: Model<Enclosure> = mongoose.model("Enclosure", enclosureSchema);