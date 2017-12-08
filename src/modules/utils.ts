import * as fs from 'fs';
import * as jose from 'node-jose';

export class Utils {
    static readFileToString(path: string): Promise<string> {
        return new Promise((resolve, reject) => {
            fs.readFile(path, (err, data) => {
                if(err) { reject(err); }
                resolve(data.toString());
            });
        });
    }

    static pemToJwk(pem: string): Promise<any> {
        return jose.JWK.asKey(pem, 'pem');
    }

    static async pemToJwks(pem: string): Promise<string> {
        const { keystore } = await jose.JWK.asKey(pem, 'pem');
        return keystore.toJSON();
    }
}