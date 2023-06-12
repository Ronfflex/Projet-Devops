import {appendFile, readFile, access} from "fs/promises";


export class MaintenanceService {

    async readMaintenanceByName(enclosure: string): Promise<string | null> {
        try {
            const filePath = `../files/${enclosure}.txt`;
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
        const filePath = `../files/${enclosure}.txt`;
        try {
            await appendFile(filePath, newEntry);
            return this.readMaintenanceByName(enclosure);
        } catch (err: unknown) {
            return null;
        }
    }

}
