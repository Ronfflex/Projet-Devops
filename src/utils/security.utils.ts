import * as crypto from "crypto";

export class SecurityUtils {
    static toSHA512(str: string): string {
        if (typeof str !== 'string') {
            throw new Error('Invalid argument: str must be a string');
        }
        
        const hash = crypto.createHash('sha512');
        hash.update(str);
        return hash.digest('hex');
    }
}