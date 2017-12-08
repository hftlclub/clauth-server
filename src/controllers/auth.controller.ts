import { UserService } from '../modules/user.service';
import { Utils } from '../modules/utils';
import { config } from '../config';
import * as express from 'express';

export class AuthController {

    index(req, res) {
        res.send('Auth Server');
    }

    async auth(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const body: AuthRequestBody = req.body;
        
            const username = body.username;
            const password = body.password;

            if(!username || !password) {
                throw new Error('Username or password missing');
            }

            const passwordCheck = await UserService.checkpassword(username, password);
            if (passwordCheck) {
                const user = await UserService.getUserByUid(username);
                res.send(user);
                
            } else {
                const err = new Error('Username or password incorrect');
                throw err;
            }
        } catch(e) {
            next(e);
        }
    }
}


interface AuthRequestBody {
    username: string;
    password: string;
}