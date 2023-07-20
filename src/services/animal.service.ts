import { Model } from "mongoose";
import { Animal, AnimalModel, Enclosure, EnclosureModel } from "../models";


export class AnimalService {

    readonly animalModel: Model<Animal>;
    readonly enclosureModel: Model<Enclosure>;

    constructor() {
        this.animalModel = AnimalModel;
        this.enclosureModel = EnclosureModel;
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
            const animals = await this.animalModel.find().populate('enclosure');
            return animals;
        } catch (error: unknown) {
            return null;
        }
    }

    async getAnimalByName(name : string): Promise<Animal | null> {
        try {
            const req = await this.animalModel.findOne({ name }).populate('enclosure');
            return req;
        } catch (error: unknown) {
            return null;
        }
    }

    async updateAnimalByName(name: string, updateData: Partial<Animal>): Promise<Animal | null> {
        try {        
            const updatedAnimal = await this.animalModel.findOneAndUpdate({ name }, updateData,{new:true}).populate('enclosure');
            return updatedAnimal;
        } catch (error: unknown) {
            return null;
        }
    }

    async deleteAnimalByName(name: string): Promise<boolean | null> {
        try{
            const deletedAnimal = await this.animalModel.findOneAndDelete({ name }).populate('enclosure');
            return deletedAnimal ? true : false;
        } catch (error: unknown) {
            return null;
        }
    }

    async moveAnimal(animalName:string, enclosureName:string):Promise<Animal | null> {
        
        try {
            const animal = await this.animalModel.findOne({name:animalName})
            
            if(animal !== null){                
                const previousEnclosure = await this.enclosureModel.findById(animal.enclosure)
                const targetEnclosure = await this.enclosureModel.findOne({name:enclosureName})
                if(previousEnclosure !== null && targetEnclosure !== null){
                    const previousAnimals = [...previousEnclosure.animals]
                    previousAnimals.splice(previousAnimals.indexOf(animal),1);
                    const updatedPrevious = await this.enclosureModel.findOneAndUpdate({name:previousEnclosure.name},{animals:previousAnimals})
                    const targetAnimals = [...targetEnclosure.animals]
                    targetAnimals.push(animal)
                    const updatedTarget = await this.enclosureModel.findOneAndUpdate({name:targetEnclosure.name},{animals:targetAnimals})
                    const updatedAnimal = await this.animalModel.findOneAndUpdate({name:animalName},{enclosure:targetEnclosure}).populate('enclosure')
                    return updatedAnimal
                }else{
                    return null
                }
            }else{
                return null
            }
        }catch(error: unknown){
            return null;
        }
    }
}