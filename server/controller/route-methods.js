import moment from 'moment';
import uuidv4 from 'uuid/v4';
import db from '../data/db';

// make routes into class methods

class routeMethods {
  static createOrder(req, res) {
    (async () => {
      const query = `INSERT INTO
        parcels(
          id,
          pickup_location,
          current_location,
          destination,
          description,
          distance,
          status,
          sender,
          recipient_email,
          created_date,
          modified_date
        ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        returning *`;

      const values = [
        uuidv4(),
        req.body.location,
        req.body.location,
        req.body.destination,
        req.body.description,
        req.body.distance,
        'created',
        'Omoefe',
        req.body.email,
        moment(new Date()),
        moment(new Date()),
      ];

      const { rows } = await db(query, values);
      res.status(201).send({
        success: true,
        message: 'Order created successfully.',
        order: rows[0],
      });
    })().catch((e) => {
      res.status(400).send({
        success: 'damn',
        error: (e),
      });
    });
  }

  static fetchAll(req, res) {
    (async () => {
      const query = 'SELECT * FROM parcels';
      const { rows, rowCount } = await db(query);
      if (rows[0]) {
        res.status(200).send({
          success: true,
          message: `${rowCount} orders retrieved.`,
          orders: rows,
        });
      } else {
        res.status(200).send({
          success: true,
          message: 'No Orders to retrieve',
        });
      }
    })().catch((e) => {
      res.status(400).send({
        success: false,
        message: e,
      });
    });
  }

  static fetchById(req, res) {
    (async () => {
      const query = 'SELECT * FROM parcels WHERE id = $1';
      const id = req.params.parcelId;
      const { rows } = await db(query, [id]);
      if (rows[0]) {
        res.status(200).send({
          success: true,
          message: `Order '${id}' retrieved.`,
          orders: rows[0],
        });
      } else {
        res.status(404).send({
          success: false,
          message: 'Invalid ID',
        });
      }
    })().catch((e) => {
      res.status(400).send({
        success: false,
        message: e,
      });
    });
  }

  static cancel(req, res) {
    (async () => {
      const id = req.params.parcelId;
      const find = 'SELECT * FROM parcels WHERE id = $1';
      const { rows } = await db(find, [id]);
      if (!rows[0]) {
        return res.status(404).send({
          success: false,
          message: 'Invalid ID',
        });
      }
      const update = `UPDATE parcels
        SET status=$1
        WHERE id=$2`;
      await db(update, ['cancelled', id]);
      return res.status(200).send({
        success: true,
        message: `Order '${id}' cancelled.`,
      });
    })().catch((e) => {
      res.status(400).send({
        success: false,
        message: e,
      });
    });
  }

  static fetchByUser(req, res) {
    (async () => {
      const user = req.params.userId;
      const query = 'SELECT * FROM parcels WHERE sender = $1';
      const { rows } = await db(query, [user]);
      if (rows[0]) {
        return res.status(200).send({
          success: true,
          message: `All orders for '${user}' retrieved successfully.`,
          orders: rows,
        });
      }
      return res.status(404).send({
        success: false,
        message: `No orders for found for '${user}'.`,
      });
    })().catch((e) => {
      res.status(400).send({
        success: false,
        message: e,
      });
    });
  }
}

export default routeMethods;
