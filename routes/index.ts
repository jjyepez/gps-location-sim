import { Router } from 'express';
import { loadJSONfile } from '../services/util';
import path from 'path';

import vehicles from './vehicles';

export const router = Router();

router

    .get('/vehicles', vehicles)
    
    .get('/support', (req, res, next) => {
        const jsonFile = path.join(__dirname, '../data/support.json');
        const jsonData = loadJSONfile(jsonFile);
        res
            .status(200)
            .json({
                error: false,
                data: jsonData
            })
        ;
    })

    .get('/coordinates', (req, res, next) => {
        const jsonFile = path.join(__dirname, '../data/coordinates.json');
        const jsonData = loadJSONfile(jsonFile);
        res
            .status(200)
            .json({
                error: false,
                data: jsonData
            })
        ;
    })

    .use((req, res) => {
        res
            .status(404)
            .send('404: NOT FOUND.')
        ;
    })
;

export default router;