import { Model, Types } from "mongoose";
import { Visitor, VisitorModel } from "../models";

export class VisitorService {
    readonly visitorModel: Model<Visitor>;

    constructor() {
        this.visitorModel = VisitorModel;
    }

    async createVisitor(visitor: { firstName: string; lastName: string; ticketId: string; }): Promise<Visitor | null> {
        try {
            const createdVisitor = await this.visitorModel.create({
                firstName: visitor.firstName,
                lastName: visitor.lastName,
                ticketId: visitor.ticketId,
            });
            return createdVisitor;
        } catch (error: unknown) {
            return null;
        }
    }

    async canAccessEnclosure(visitorId: string, enclosureId: string): Promise<boolean> {
        try {
            const visitor = await this.visitorModel.findById(visitorId).populate('ticketId');
            console.log(visitor);
            if(visitor === null) {
                return false;
            }

            // If visitor's current enclosure is already set and different from the new one
            if(visitor.currentEnclosureId && visitor.currentEnclosureId.toString() !== enclosureId) {
                return false;
            }

            // If visitor's ticket does not allow to access the enclosure
            // if(!visitor.ticketId.validEnclosures.includes(enclosureId)) {
            //     return false;
            // }

            return true;
        } catch (error: unknown) {
            console.error(error);
            return false;
        }
    }

}