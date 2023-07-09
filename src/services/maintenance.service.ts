import { promises as fs } from "fs";
import * as path from "path";

interface MaintenanceEntry {
    date: string;
    comment: string;
}

export class MaintenanceService {
    
    async readMaintenanceByName(enclosure: string): Promise<MaintenanceEntry[] | null> {
        try {
            // Replace all spaces in the enclosure name with underscores
            const enclosureFormatted = enclosure.replace(/\s+/g, '_');
            const filePath = path.resolve(`src/files/${enclosureFormatted}.json`);
            const data = await fs.readFile(filePath, 'utf-8');
            const jsonData = JSON.parse(data);
            return jsonData;
        } catch (err: unknown) {
            console.error(err);
            return null;
        }
    }
    
    async modifyMaintenanceByName(enclosure: string, comment: string, editor: string): Promise<MaintenanceEntry[] | null> {
        const date = new Date().toISOString();
        const newEntry = { date, editor , comment };
        // Replace all spaces in the enclosure name with underscores
        const enclosureFormatted = enclosure.replace(/\s+/g, '_');
        const filePath = path.resolve(`src/files/${enclosureFormatted}.json`);
    
        try {
            const data = await this.readMaintenanceByName(enclosure);
            const jsonData = data ? [...data, newEntry] : [newEntry];
    
            await fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), 'utf-8');
            return jsonData;
        } catch (err: unknown) {
            console.error(err);
            return null;
        }
    }
    
    

}
