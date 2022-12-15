import { Router } from 'express';

import { loadJSONfile } from '../services/util';
import path from 'path';

export const router = Router();

const jsonFile = path.join(__dirname, '../data/vehicles.json');
const jsonData = loadJSONfile(jsonFile);

import { Vehicle } from '../types'

router
    .get('/', (req, res, next) => {
        res
            .status(200)
            .json({
                error: false,
                data: jsonData
            })
        ;
    })

    .get('/:id', (req, res, next) => {
        const { id } = req.params;
        const data = jsonData.vehicles.filter((reg:Vehicle) => reg.id === Number(id));

        res
            .status(200)
            .json({
                error: false,
                data: 999
            })
        ;
    })

    .get('/:id/locations', (req, res, next) => {
        const { id } = req.params;
        const data = jsonData.vehicles.filter((reg:Vehicle) => reg.id === Number(id));

        res
            .status(200)
            .json({
                error: false,
                data: 9119
            })
        ;
    })
;

export default router;