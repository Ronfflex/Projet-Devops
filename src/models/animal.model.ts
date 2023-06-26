import mongoose, {Model, Schema} from "mongoose";
import { Enclosure } from "./enclosure.model";

export interface Animal {
    _id?: string;
    name: string;
    description: string;
    image: string; // URL or path to image
    species: string; // The species of the animal e.g. "Lion"
    age: number; // total people allowed
    enclosure: string | Enclosure // Enclosure
}

const animalSchema = new Schema<Animal>({
    name: {type: String, required: true, unique: true},
    description: {type: String, required: true},
    image: {type: String, required: true},
    species: {type: String, required: true},
    age: {type: Number, required: true},
    enclosure : {type : Schema.Types.ObjectId, ref: 'Enclosure', required: true}
}, {
    collection: "animal",
    versionKey: false,
});

export const AnimalModel: Model<Animal> = mongoose.model("Animal", animalSchema);