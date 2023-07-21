import { Model } from "mongoose";
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

}