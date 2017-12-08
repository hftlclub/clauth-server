import * as express from 'express';

import { Utils } from '../modules/utils';
import { config } from '../../config';
import { UserService } from '../modules/user.service';
import { JwtService } from '../modules/jwt.service';
import { CredentialsMissingError, CredentialsWrongError } from '../modules/errors';

export class AuthController {

    index(req: express.Request, res: express.Response) {
        res.send('Auth Server');
    }

    async auth(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const body: AuthRequestBody = req.body;
        
            const username = body.username;
            const password = body.password;

            if(!username || !password) {
                throw new CredentialsMissingError();
            }

            const passwordCheck = await UserService.checkpassword(username, password);
            if (passwordCheck) {
                const user = await UserService.getUserByUid(username);

                const payload = {
                    username: user.username,
                    firstname: user.firstname,
                    lastname: user.lastname,
                }

                const jwt = await JwtService.createToken(payload);
                res.send(jwt);
                
            } else {
                throw new CredentialsWrongError();
            }
        } catch(e) {
            next(e);
        }
    }

    async getPublicJWKS(req: express.Request, res: express.Response, next: express.NextFunction) {
        res.send(await JwtService.getPublicJWKS());
    }
}


interface AuthRequestBody {
    username: string;
    password: string;
}