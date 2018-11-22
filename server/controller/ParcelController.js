import 'babel-polyfill';
import moment from 'moment';
import db from '../config/dbconnect';

/** Class representing parcel delivery order route methods */
class ParcelController {
  /**
   * Create a parcel delivery  order.
   * @param {object} req the request object.
   * @param {object} res the response object.
   */
  static async createOrder(req, res) {
    try {
      const {
        weight, location, destination, distance, price,
      } = req.body;

      const placedBy = req.user;

      const query = `INSERT INTO
        parcels(
          placed_by,
          weight,
          sent_on,
          pickup_location,
          current_location,
          destination,
          distance,
          price
        ) VALUES($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *`;

      const values = [
        placedBy,
        weight,
        moment().format('MMMM Do YYYY, h:mm:ss a'),
        location,
        location,
        destination,
        distance,
        price,
      ];

      const { rows: [parcel], rows: [{ id }] } = await db(query, values);

      delete parcel.placed_by;
      delete parcel.weight_metric;
      delete parcel.distance_metric;

      parcel.distance = `${parcel.distance} km`;
      parcel.weight = `${parcel.weight} kg`;

      return res.status(201).json({
        status: 201,
        data: [{
          id,
          message: 'order created',
        }, {
          parcel,
        }],
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        error,
      });
    }
  }

  /**
   * Fetch all parcel delivery orders for a particular user.
   * @param {object} req the request object.
   * @param {object} res the response object.
   */
  static async fetchAllOrdersForUser(req, res) {
    try {
      const query = 'SELECT * FROM parcels WHERE placed_by = $1';
      const { rows: orders, rowCount: count } = await db(query, [req.user]);
      return res.status(200).json({
        status: 200,
        data: [{
          count,
        }, {
          orders,
        }],
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        error,
      });
    }
  }

  /**
   * Change the destination of a parcel delivery order.
   * @param {object} req the request object.
   * @param {object} res the response object.
   */
  static async changeDestination(req, res) {
    try {
      const {
        destination: newDestination, distance: newDistance, price: additionalPrice
      } = req.body;
      const id = req.params.parcelId;
      const update = `UPDATE parcels
        SET destination=$1, distance=$2
        WHERE id=$3`;
      await db(update, [
        newDestination,
        newDistance,
        id,
      ]);
      return res.status(200).json({
        status: 200,
        data: [{
          id,
          newDestination,
          message: 'parcel destination updated',
          newDistance,
          additionalPrice,
        }],
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        error,
      });
    }
  }

  /**
   * Change the location of a parcel.
   * @param {object} req the request object.
   * @param {object} res the response object.
   */
  static async changeLocation(req, res) {
    try {
      const id = req.params.parcelId;
      const { distance: newDistance, location: currentLocation } = req.body;
      const update = `UPDATE parcels
        SET current_location=$1, distance=$2
        WHERE id=$3
        RETURNING *`;
      await db(update, [
        currentLocation,
        newDistance,
        id,
      ]);
      return res.status(200).json({
        status: 200,
        data: [{
          id,
          currentLocation,
          message: 'parcel location updated',
          newDistance,
        }],
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        error,
      });
    }
  }

  /**
   * Enable an admin fetch all parcel delivery orders in the app.
   * @param {object} req the request object.
   * @param {object} res the response object.
   */
  static async fetchAllOrdersInApp(req, res) {
    try {
      if (!req.admin) {
        return res.status(401).json({
          status: 401,
          error: 'Unauthorized',
        });
      }

      const queryText = 'SELECT * FROM parcels';
      const { rows: orders, rowCount: count } = await db(queryText);
      res.status(200).json({
        status: 200,
        data: [{
          count,
        }, {
          orders,
        }],
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        error,
      });
    }
  }

  /**
   * Change the status of a parcel delivery order.
   * @param {object} req the request object.
   * @param {object} res the response object.
   */
  static async changeOrderStatus(req, res) {
    try {
      if (!req.admin) {
        return res.status(401).json({ status: 401, error: 'Unauthorized' });
      }

      const query = 'SELECT * FROM parcels WHERE id = $1';
      const id = req.params.parcelId;
      const { status } = req.body;
      const { rows: [parcel], rows: [{ status: existingStatus }] } = await db(query, [id]);
      const rejectIf = ['cancelled', 'delivered'];
      if (!parcel || rejectIf.includes(existingStatus)) {
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
    } catch (error) {
      res.status(500).json({
        status: 500,
        error,
      });
    }
  }

  /**
   * Fetch a parcel delivery order by Id.
   * @param {object} req the request object.
   * @param {object} res the response object.
   */
  static async fetchParcelById(req, res) {
    try {
      const query = 'SELECT * FROM parcels WHERE placed_by = $1 AND id = $2';
      const { parcelId } = req.params;
      const id = req.user;
      const { rows } = await db(query, [id, parcelId]);
      if (rows[0]) {
        delete (rows[0].placed_by);
        return res.status(200).json({
          status: 200,
          data: [{
            order: rows[0],
          }],
        });
      }
      return res.status(404).json({
        status: 404,
        error: 'invalid ID',
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        error,
      });
    }
  }

  /**
   * Cancel a parcel delivery order.
   * @param {object} req the request object.
   * @param {object} res the response object.
   */
  static async cancelOrder(req, res) {
    try {
      const query = 'SELECT * FROM parcels WHERE placed_by = $1 AND id = $2';
      const { parcelId } = req.params;
      const id = req.user;
      const { rows } = await db(query, [id, parcelId]);
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
      await db(update, ['cancelled', parcelId]);
      return res.status(200).send({
        status: 200,
        data: [{
          parcelId,
          message: 'order cancelled',
        }],
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        error,
      });
    }
  }

  /**
   * Fetch orders by user.
   * @param {object} req the request object.
   * @param {object} res the response object.
   */
  static async adminFetchByUser(req, res) {
    try {
      if (!req.admin) {
        return res.status(401).json({
          status: 401,
          error: 'Unauthorized',
        });
      }
      const { userId } = req.params;
      const query = 'SELECT * FROM parcels WHERE placed_by = $1';
      const { rows, rowCount } = await db(query, [userId]);
      if (rows[0]) {
        return res.status(200).json({
          status: 200,
          data: [{
            count: rowCount,
          }, {
            orders: rows,
          }],
        });
      }
      return res.status(200).json({
        status: 200,
        data: ['No Orders to retrieve'],
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        error,
      });
    }
  }
}

export default ParcelController;
