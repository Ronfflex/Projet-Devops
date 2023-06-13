import {appendFile, readFile, mkdir} from "fs/promises";


export class MaintenanceService {

    async readMaintenanceByName(enclosure: string): Promise<string | null> {
        try {
            // Replace all spaces in the enclosure name with underscores
            const enclosureFormatted = enclosure.replace(/\s+/g, '_');
            const filePath = `src/files/${enclosureFormatted}.txt`;
            const buf = await readFile(filePath);
            const str = buf.toString();
            return str;
        } catch (err: unknown) {
            return null;
        }
    }

    async modifyMaintenanceByName(enclosure: string, comment: string): Promise<string | null> {
        const date = new Date().toISOString();
        const newEntry = `\n\n${date}\n${comment}`;
        // Replace all spaces in the enclosure name with underscores
        const enclosureFormatted = enclosure.replace(/\s+/g, '_');
        const filePath = `src/files/${enclosureFormatted}.txt`;
        try {
            await appendFile(filePath, newEntry);
            const result = await this.readMaintenanceByName(enclosureFormatted);
            return result;
        } catch (err) {
            return null;
        }
    }
    

}
