import express from 'express';
import bodyParser from 'body-parser';

import db from './db/db';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/api/v1/parcels', (req, res) => {

});

app.get('/api/v1/parcels', (req, res) => {

});

app.get('/api/v1/parcels/:parcelId', (req, res) => {

});


app.put('/api/v1/parcels/:parcelId/cancel', (req, res) => {

});

app.get('/api/v1/users/:userId/parcels', (req, res) => {

});

export default app;
