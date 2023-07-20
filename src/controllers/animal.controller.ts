import { ExpressController } from "./controller.interface";
import { Request, Response, Router } from "express";
import * as express from "express";
import { AnimalService, EnclosureService } from "../services";
import { ExpressUtils } from "../utils";
import { validateCreateAnimalRequest, validateUpdateAnimalByNameRequest } from "../middlewares";
import { Animal } from "../models";

export class AnimalController implements ExpressController {

    readonly path: string;
    readonly animalService: AnimalService;
    readonly enclosureService: EnclosureService;

    constructor() {
        this.path = "/animal";
        this.animalService = new AnimalService();
        this.enclosureService = new EnclosureService();
    }

    /** [POST] **/
    /* Create animal */
    async create(req: Request, res: Response): Promise<void> {
        const {
            name,
            description,
            image,
            species,
            age,
            enclosure
        } = req.body;
    
        // Trim and lowercase all string values
        const trimmedName = name.trim().toLowerCase();
        const trimmedDescription = description.trim();
        const trimmedImage = image.trim();
        const trimmedSpecies = species.trim().toLowerCase();
        const trimmedEnclosure = enclosure.trim().toLowerCase();

        const desiredEnclosure = await this.enclosureService.getEnclosureByName(trimmedEnclosure)
        
        const animal = await this.animalService.createAnimal({
            name: trimmedName,
            description: trimmedDescription,
            image: trimmedImage,
            species: trimmedSpecies,
            age,
            enclosure: desiredEnclosure? desiredEnclosure : ""
        });

        if(desiredEnclosure != null && animal != null){
            const animals = [...desiredEnclosure.animals]
            animals.push(animal)
            this.enclosureService.updateEnclosureByName(trimmedEnclosure,{
                animals:animals as Animal[]
            })
        }
    
        animal ? res.json(animal) : ExpressUtils.conflict(res);
    }
    

    /** [GET] **/
    /* Get all animals */
    async getAll(req: Request, res: Response): Promise<void> {    
        const animals = await this.animalService.getAllAnimals();
        animals ? res.json(animals) : ExpressUtils.notFound(res);
    }

    /* Get animal by name */
    async getByName(req: Request, res: Response): Promise<void> {
        if (typeof req.query.name === 'string') {
            const name = req.query.name.trim().toLowerCase();
    
            if (!ExpressUtils.isValid(res, name, 'string', 2, 50)) {
                return;
            }
    
            const animal = await this.animalService.getAnimalByName(name);
            animal ? res.json(animal) : ExpressUtils.notFound(res);
        } else {
            ExpressUtils.badRequest(res);
        }
    }


    /** [PATCH] **/
    /* Update animal by name */
    async updateByName(req: Request, res: Response): Promise<void> {
        const name = req.params.name.trim().toLowerCase();
        
        
        const {
            description,
            image,
            species,
            age,
            enclosure
        } = req.body;
        
        const updatedAnimal = await this.animalService.updateAnimalByName(name, {
            description,
            image,
            species,
            age,
            enclosure
        });        
    
        updatedAnimal ? res.json(updatedAnimal) : ExpressUtils.notFound(res);
    }

    async moveAnimal(req: Request, res: Response): Promise<void> {
        const {
            animal,
            enclosure
        } = req.body
        
        const updatedAnimal = await this.animalService.moveAnimal(animal.toLowerCase(), enclosure.toLowerCase());
    
        updatedAnimal ? res.json(updatedAnimal) : ExpressUtils.notFound(res);
    }


    /** [DELETE] **/
    /* Delete animal by name */
    async deleteByName(req: Request, res: Response): Promise<void> {
        const name = req.params.name.trim().toLowerCase();
        if (!ExpressUtils.isValid(res, name, 'string', 2, 50)) {
            return;
        }
        
        const deletedAnimal = await this.animalService.deleteAnimalByName(name);
        deletedAnimal ? ExpressUtils.noContent(res) : ExpressUtils.notFound(res);
    }



    /* Router */
    buildRoutes(): Router {
        const router = express.Router();
        router.get('/', this.getAll.bind(this));
        router.get('/id', this.getByName.bind(this));
        router.post('/create', express.json(), validateCreateAnimalRequest, this.create.bind(this));
        router.patch('/move', express.json(),  this.moveAnimal.bind(this));
        router.patch('/:name', express.json(), validateUpdateAnimalByNameRequest, this.updateByName.bind(this));
        router.delete('/:name', this.deleteByName.bind(this));
        return router;
    }
}