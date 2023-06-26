import { Model } from "mongoose";
import { Animal, AnimalModel } from "../models";


export class AnimalService {

    readonly animalModel: Model<Animal>;

    constructor() {
        this.animalModel = AnimalModel;
    }

    async createAnimal(animal: Animal): Promise<Animal | null> {
        try {
            const createdAnimal = await this.animalModel.create({
                name: animal.name,
                description: animal.description,
                image: animal.image,
                species: animal.species,
                age: animal.age,
                enclosure: animal.enclosure
            });
            return createdAnimal;
        } catch (error: unknown) {
            return null;
        }
    }

    async getAllAnimals(): Promise<Animal[] | null> {
        try {
            const animals = await this.animalModel.find();
            return animals;
        } catch (error: unknown) {
            return null;
        }
    }

    async getAnimalByName(name : string): Promise<Animal | null> {
        try {
            const req = await this.animalModel.findOne({ name });
            return req;
        } catch (error: unknown) {
            return null;
        }
    }

    async updateAnimalByName(name: string, updateData: Partial<Animal>): Promise<Animal | null> {
        try {
            const updatedAnimal = await this.animalModel.findOneAndUpdate({ name }, updateData, { new: true });
            return updatedAnimal;
        } catch (error: unknown) {
            return null;
        }
    }

    async deleteAnimalByName(name: string): Promise<boolean | null> {
        try{
            const deletedAnimal = await this.animalModel.findOneAndDelete({ name });
            return deletedAnimal ? true : false;
        } catch (error: unknown) {
            return null;
        }
    }
}