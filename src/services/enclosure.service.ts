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

    async getAllEnclosures(): Promise<Enclosure[] | null> {
        try {
            const enclosures = await this.enclosureModel.find().populate('animals');
            return enclosures;
        } catch (error: unknown) {
            return null;
        }
    }

    async getEnclosureByName(name : string): Promise<Enclosure | null> {
        try {
            const req = await this.enclosureModel.findOne({ name }).populate('animals');
            return req;
        } catch (error: unknown) {
            return null;
        }
    }

    async updateEnclosureByName(name: string, updateData: Partial<Enclosure>): Promise<Enclosure | null> {
        try {
            const updatedEnclosure = await this.enclosureModel.findOneAndUpdate({ name }, updateData, { new: true }).populate('animals');
            return updatedEnclosure;
        } catch (error: unknown) {
            return null;
        }
    }

    async setMaintenance(name: string, status: boolean): Promise<Enclosure | null> {
        try {
            const updatedEnclosure = await this.enclosureModel.findOneAndUpdate({ name }, { status }, { new: true }).populate('animals');
            return updatedEnclosure;
        } catch (error: unknown) {
            return null;
        }
    }

    async deleteEnclosureByName(name: string): Promise<boolean | null> {
        try{
            const deletedEnclosure = await this.enclosureModel.findOneAndDelete({ name }).populate('animals');
            return deletedEnclosure ? true : false;
        } catch (error: unknown) {
            return null;
        }
    }
}