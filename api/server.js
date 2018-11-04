import express from 'express';
import bodyParser from 'body-parser';
import db from './db/db';

// set up the express app
const app = express();

// parse incoming request data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// get all orders
app.get('/api/v1/orders', (req, res) => {
  res.status(200).send({
    success: 'true',
    message: 'orders retrieved successfully',
    orders: db,
  });
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
