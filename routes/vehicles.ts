import fs from 'fs';
import { Router } from 'express';

import { loadJSONfile } from '../services/util';
import path from 'path';

export const router = Router();

require('dotenv').config();

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
                data
            })
        ;
    })

    .get('/:id/locations/history', (req, res, next) => {
        const { id } = req.params;
        const jsonFile = path.join(__dirname, `../data/states/${id}.json`);
        const jsonLatestData = loadJSONfile(jsonFile);

        const jsonCoordsFile = path.join(__dirname, `../data/coordinates.json`);
        const jsonCoordsData = loadJSONfile(jsonCoordsFile).coordinates;

        let [lat, lng] = jsonLatestData.location;
        
        const secsDiff = (Date.now() - jsonLatestData.updatedAt) / 1000;

        const secs:number = Number(process.env.COORDS_UPDATE_RATE) || 20;
        const now = Date.now();
        let nextI = jsonLatestData.i;
        if(secsDiff >= secs){
            // han pasado más de <n> segundos desde el último reporte
            nextI = jsonLatestData.i + ~~(secsDiff / secs);
            if(nextI > jsonCoordsData.length) nextI = 0;
            const newCoords = jsonCoordsData[nextI];
            [lat, lng] = newCoords;
            fs.writeFile(jsonFile, JSON.stringify({
                i: nextI,
                updatedAt: now,
                location: newCoords
            }), ()=>{});
        };

        const historyLimit = 100; // el history muestra las última 100 posiciones
        const doubleCoords = [...jsonCoordsData, ...jsonCoordsData];
        const offset = (jsonCoordsData.length + nextI) - historyLimit;

        const data = {
            updatedAt: Date.now(),
            coordinates: doubleCoords.slice(offset, offset + historyLimit),
            range: [nextI, offset, jsonCoordsData.length]
        }

        res
            .status(200)
            .json({
                error: false,
                data
            })
        ;
    })

    .get('/:id/locations/latest', (req, res, next) => {
        const { id } = req.params;
        const jsonFile = path.join(__dirname, `../data/states/${id}.json`);
        const jsonLatestData = loadJSONfile(jsonFile);

        const jsonCoordsFile = path.join(__dirname, `../data/coordinates.json`);
        const jsonCoordsData = loadJSONfile(jsonCoordsFile).coordinates;

        let [lat, lng] = jsonLatestData.location;
        
        const secsDiff = (Date.now() - jsonLatestData.updatedAt) / 1000;

        const now = Date.now();
        if(secsDiff >= 20){
            // han pasado más de 30 segundos desde el último reporte
            let newI = jsonLatestData.i + ~~(secsDiff / 20);
            if(newI > jsonCoordsData.length) newI = 0;
            const newCoords = jsonCoordsData[newI];
            [lat, lng] = newCoords;
            fs.writeFile(jsonFile, JSON.stringify({
                i: newI,
                updatedAt: now,
                location: newCoords
            }), ()=>{});
        };

        const data = {
            updatedAt: now,
            coordinates: {
                lat,
                lng
            } 
        }

        res
            .status(200)
            .json({
                error: false,
                data
            })
        ;
    })
;

export default router;