import express from 'express';
import bodyParser from 'body-parser';

import db from './db/db';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/api/v1/parcels', (req, res) => {
  if (req.body.pickupLocation && req.body.destination && req.body.description) {
    const order = {
      id: db.length + 1,
      user: 'Omoefe',
      status: 'created',
      pickupLocation: req.body.pickupLocation,
      currentLocation: req.body.pickupLocation,
      destination: req.body.destination,
      description: req.body.description,
    };
    db.push(order);
    return res.status(201).send({
      success: true,
      message: 'Order created successfully.',
      order,
    });
  }

  return res.status(400).send({
    success: false,
    message: 'Please fill all fields.',
  });
});

app.get('/api/v1/parcels', (req, res) => {
  if (db[0]) {
    return res.status(200).send({
      success: true,
      message: 'Orders retrieved successfully.',
      orders: db,
    });
  }

  return res.status(200).send({
    success: true,
    message: 'No orders to retrieve.',
  });
});

app.get('/api/v1/parcels/:parcelId', (req, res) => {

});


app.put('/api/v1/parcels/:parcelId/cancel', (req, res) => {

});

app.get('/api/v1/users/:userId/parcels', (req, res) => {

});

export default app;
