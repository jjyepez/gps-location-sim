import express from 'express';
import morgan from 'morgan';

import routes from './routes';

const app = express();

// middlewares
app
    .use(express.json())
    .use(morgan('dev'))
;
// routes
app
    .use('/', routes)
;

const host = process.env.EXPRESS_HOST || 'localhost';
const port = Number(process.env.EXPRESS_PORT) || 7777;
app.listen(port, host, () => {
    console.log(`Iniciado en http://${host}:${port}`);
});