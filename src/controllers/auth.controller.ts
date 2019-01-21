import * as express from 'express';

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
            const { username, password } = body;

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
                    isAdmin: user.superuser
                }

                const token = await JwtService.createToken(payload);

                const response: TokenResponse = {
                    token,
                    expiresIn: config.tokenLifetime,
                    type: 'Bearer'
                }
                res.send(response);
                
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

interface TokenResponse {
    token: string;
    expiresIn: number;
    type: string;
  }