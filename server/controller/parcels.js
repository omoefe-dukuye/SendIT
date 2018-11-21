import 'babel-polyfill';
import moment from 'moment';
import db from '../utility/dbconnect';

// make routes into class methods

class routeMethods {
  static createOrder(req, res) {
    (async () => {
      const query = `INSERT INTO
        parcels(
          placed_by,
          weight,
          sent_on,
          status,
          pickup_location,
          current_location,
          destination,
          distance
        ) VALUES($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *`;

      const values = [
        req.user.id,
        req.body.weight,
        moment().format('MMMM Do YYYY, h:mm:ss a'),
        'created',
        req.body.location,
        req.body.location,
        req.body.destination,
        req.body.distance,
      ];

      const { rows } = await db(query, values);
      res.status(201).json({
        status: 201,
        data: [{
          id: rows[0].id,
          message: 'order created',
        }, {
          details: rows[0],
        }],
      });
    })();
  }

  static fetchAll(req, res) {
    (async () => {
      const query = 'SELECT * FROM parcels WHERE placed_by = $1';
      const { rows, rowCount } = await db(query, [req.user.id]);
      res.status(200).json({
        status: 200,
        data: [{
          count: rowCount,
        }, {
          orders: rows,
        }],
      });
    })();
  }

  static changeDest(req, res) {
    (async () => {
      const id = req.params.parcelId;
      const update = `UPDATE parcels
        SET destination=$1, distance=$2
        WHERE id=$3
        RETURNING *`;
      const updated = await db(update, [
        req.body.destination,
        req.body.distance,
        id,
      ]);
      return res.status(200).json({
        status: 200,
        data: [{
          id,
          newDestination: updated.rows.destination,
          message: 'parcel destination updated',
          'new distance': req.body.distance,
        }],
      });
    })();
  }

  static location(req, res) {
    (async () => {
      const id = req.params.parcelId;
      const { location } = req.body;
      const update = `UPDATE parcels
        SET current_location=$1, distance=$2
        WHERE id=$3
        RETURNING *`;
      await db(update, [
        location,
        req.body.distance,
        id,
      ]);
      return res.status(200).json({
        status: 200,
        data: [{
          id,
          currentLocation: location,
          message: 'parcel location updated',
          'new distance': req.body.distance,
        }],
      });
    })();
  }

  static adminFetchAll(req, res) {
    (async () => {
      if (!req.admin) {
        return res.status(401).json({
          status: 401,
          error: 'Unauthorized',
        });
      }

      const queryText = 'SELECT * FROM parcels';
      const { rows, rowCount } = await db(queryText);
      res.status(200).json({
        status: 200,
        data: [{
          count: rowCount,
        }, {
          orders: rows,
        }],
      });
      return undefined;
    })();
  }

  static status(req, res) {
    (async () => {
      if (!req.admin) {
        return res.status(401).json({ status: 401, error: 'Unauthorized' });
      }

      const query = 'SELECT * FROM parcels WHERE id = $1';
      const id = req.params.parcelId;
      const { status } = req.body;
      const { rows } = await db(query, [id]);
      if (!rows[0] || rows[0].status === 'cancelled' || rows[0].status === 'delivered') {
        return res.status(409).json({ status: 409, error: 'invalid request' });
      }

      let update;
      let values;

      if (status === 'delivered') {
        update = `UPDATE parcels
          SET status=$1, delivered_on=$3
          WHERE id=$2`;
        values = [
          status,
          id,
          moment().format('MMMM Do YYYY, h:mm:ss a'),
        ];
      } else {
        update = `UPDATE parcels
          SET status=$1 WHERE id=$2`;
        values = [
          status,
          id,
        ];
      }
      await db(update, values);
      return res.status(200).json({
        status: 200,
        data: [{
          id,
          status,
          message: 'parcel status changed',
        }],
      });
    })();
  }

  static fetchById(req, res) {
    (async () => {
      const query = 'SELECT * FROM parcels WHERE placed_by = $1 AND id = $2';
      const id = req.params.parcelId;
      const { rows } = await db(query, [req.user.id, id]);
      if (rows[0]) {
        res.status(200).json({
          status: 200,
          data: [{
            order: rows[0],
          }],
        });
      } else {
        res.status(404).json({
          status: 404,
          error: 'invalid ID',
        });
      }
    })();
  }

  static cancel(req, res) {
    (async () => {
      const query = 'SELECT * FROM parcels WHERE placed_by = $1 AND id = $2';
      const id = req.params.parcelId;
      const { rows } = await db(query, [req.user.id, id]);
      if (!rows[0]) {
        return res.status(404).json({
          status: 404,
          error: 'invalid ID',
        });
      }
      if (rows[0].status === 'delivered') {
        return res.status(409).json({
          status: 409,
          error: 'already delivered',
        });
      }
      const update = `UPDATE parcels
        SET status=$1
        WHERE id=$2`;
      await db(update, ['cancelled', id]);
      return res.status(200).send({
        status: 200,
        data: [{
          id,
          message: 'order cancelled',
        }],
      });
    })();
  }

  static fetchByUser(req, res) {
    (async () => {
      if (!req.admin) {
        return res.status(401).json({
          status: 401,
          error: 'Unauthorized',
        });
      }
      const user = req.params.userId;
      const query = 'SELECT * FROM parcels WHERE placed_by = $1';
      const { rows, rowCount } = await db(query, [user]);
      if (rows[0]) {
        res.status(200).json({
          status: 200,
          data: [{
            count: rowCount,
          }, {
            orders: rows,
          }],
        });
      } else {
        res.status(200).json({
          status: 200,
          data: ['No Orders to retrieve'],
        });
      }
      return undefined;
    })();
  }
}

export default routeMethods;
