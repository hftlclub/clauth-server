import * as express from 'express';
import * as bodyParser from 'body-parser';

import { AuthController } from './src/controllers/auth.controller';
import { config } from './src/config';

const app = express();
const authCtrl = new AuthController();

app.use(bodyParser.json());

// ROUTES
app.get('/', authCtrl.index.bind(authCtrl));
app.post('/auth', authCtrl.auth.bind(authCtrl));

// error handling
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError) {
        next(new Error('Error reading request body'));
    } else {
        next(err);
    }
});

app.use((err, req, res, next) => {
  console.error(new Date(), err.message);
  res.status(err.status || 500).send(err.message);
});

app.listen(config.port, err => {
  console.log('Auth server started on port ' + config.port);
});
