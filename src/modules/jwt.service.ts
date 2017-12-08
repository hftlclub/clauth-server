import * as jwt from 'jsonwebtoken';
import * as fs from 'fs';
import * as path from 'path';
import * as jose from 'node-jose';

import { config } from '../../config';
import { Utils } from './utils';

export class JwtService {
    static async createToken(payload: any) {
        const privateKey = await Utils.readFileToString(config.keys.private);
        const { kid } = await Utils.pemToJwk(privateKey);

        payload = {
            ...payload,
            kid: kid
        }

        return jwt.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: 3600,
        });
    }
    
    static async getPublicJWKS() {
        const pubKeyPem = await Utils.readFileToString(config.keys.public);
        return await Utils.pemToJwks(pubKeyPem);
    }

    


}