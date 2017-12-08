import * as express from 'express';
import * as bodyParser from 'body-parser';

import { AuthController } from './src/controllers/auth.controller';
import { config } from './config';
import { RequestBodyError } from './src/modules/errors';

const app = express();
const authCtrl = new AuthController();

app.use(bodyParser.json());

// ROUTES
app.get('/', authCtrl.index.bind(authCtrl));
app.post('/auth', authCtrl.auth.bind(authCtrl));
app.get('/.well-known/jwks.json', authCtrl.getPublicJWKS.bind(authCtrl));

// error handling
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError) {
        next(new RequestBodyError());
    } else {
        next(err);
    }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).send(err.message);
});

app.listen(config.port, err => {
  console.log('Auth server started on port ' + config.port);
});
