import moment from 'moment';
import uuidv4 from 'uuid/v4';
import db from '../utility/dbconnect';

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
          sender_id,
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
        req.user.id,
        req.body.email,
        moment().format('MMMM Do YYYY, h:mm:ss a'),
        moment().format('MMMM Do YYYY, h:mm:ss a'),
      ];

      const { rows } = await db(query, values);
      res.status(201).send({
        success: true,
        message: 'Order created successfully.',
        order: rows[0],
      });
    })().catch((e) => {
      res.status(400).send({
        success: false,
        error: (e),
      });
    });
  }

  static fetchAll(req, res) {
    (async () => {
      const query = 'SELECT * FROM parcels WHERE sender_id = $1';
      const { rows, rowCount } = await db(query, [req.user.id]);
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

  static changeDest(req, res) {
    (async () => {
      const query = 'SELECT * FROM parcels WHERE sender_id = $1 AND id = $2';
      const id = req.params.parcelId;
      const { destination } = req.body;
      const { rows } = await db(query, [req.user.id, id]);
      if (!rows[0] || rows[0].status === 'cancelled') {
        return res.status(404).send({ error: 'Order non-existent or cancelled' });
      }

      const update = `UPDATE parcels
        SET destination=$1, distance=$2, modified_date=$3
        WHERE id=$4
        RETURNING *`;
      const updated = await db(update, [
        destination,
        req.body.distance,
        moment().format('MMMM Do YYYY, h:mm:ss a'),
        id,
      ]);
      return res.status(200).send({
        message: `Destination updated for order '${id}'`,
        'new distance': req.body.distance,
        'updated order': updated.rows,
      });
    })().catch((error) => {
      res.status(400).send({ me: error });
    });
  }

  static adminFetchAll(req, res) {
    (async () => {
      if (!req.admin) {
        return res.status(401).send({ error: 'Unauthorized' });
      }

      const queryText = 'SELECT * FROM parcels';
      const { rows, rowCount } = await db(queryText);
      if (rows[0]) {
        res.status(200).send({
          message: `${rowCount} orders retrieved.`,
          orders: rows,
        });
      } else {
        res.status(200).send({
          message: 'No Orders to retrieve',
        });
      }

      return undefined;
    })().catch((error) => {
      res.status(400).send({ error });
    });
  }

  static fetchById(req, res) {
    (async () => {
      const query = 'SELECT * FROM parcels WHERE sender_id = $1 AND id = $2';
      const id = req.params.parcelId;
      const { rows } = await db(query, [req.user.id, id]);
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
      const query = 'SELECT * FROM parcels WHERE sender_id = $1 AND id = $2';
      const id = req.params.parcelId;
      const { rows } = await db(query, [req.user.id, id]);
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
      const query = 'SELECT * FROM parcels WHERE sender_id = $1';
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
