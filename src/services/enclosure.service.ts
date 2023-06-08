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
                image: enclosure.image,
                type: enclosure.type,
                capacity: enclosure.capacity,
                openingHours: enclosure.openingHours,
                duration: enclosure.duration,
                status: enclosure.status,
                bestMaintenanceMonth: enclosure.bestMaintenanceMonth,
                handicapAccessible: enclosure.handicapAccessible
            });
            return createdEnclosure;
        } catch (error: unknown) {
            return null;
        }
    }

    async getAllEnclosures(): Promise<Enclosure[]> {
        try {
            const enclosures = await this.enclosureModel.find();
            return enclosures;
        } catch (error: unknown) {
            return [];
        }
    }

    async getEnclosureByName(name : string): Promise<Enclosure | null> {
        try {
            const req = await this.enclosureModel.findOne({ name });
            return req;
        } catch (error: unknown) {
            return null;
        }
    }

    async updateEnclosureByName(name: string, updateData: Partial<Enclosure>): Promise<Enclosure | null> {
        try {
            const updatedEnclosure = await this.enclosureModel.findOneAndUpdate({ name }, updateData, { new: true });
            return updatedEnclosure;
        } catch (error: unknown) {
            return null;
        }
    }
}