import { Model } from "mongoose";
import { Enclosure, EnclosureModel } from "../models";


export class EnclosureService {

    readonly enclosureModel: Model<Enclosure>;

    constructor() {
        this.enclosureModel = EnclosureModel;
    }

    async createEnclosure(enclosure: Enclosure): Promise<Enclosure | null> {
        try {
            const createdEnclosure = await this.enclosureModel.create({
                name: enclosure.name,
                description: enclosure.description,
                imageUrl: enclosure.imageUrl,
                type: enclosure.type,
                capacity: enclosure.capacity,
                actualCapacity: enclosure.actualCapacity,
                openingHours: enclosure.openingHours,
                // closingHours: enclosure.closingHours,
                duration: enclosure.duration,
                maintenance: enclosure.maintenance,
                handicapAccessible: enclosure.handicapAccessible
            });
            return createdEnclosure;
        } catch (error: unknown) {
            return null;
        }
    }
}