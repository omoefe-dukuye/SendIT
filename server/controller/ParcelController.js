import 'babel-polyfill';
import moment from 'moment';
import db from '../config/dbconnect';
import {
  createOrder, updateToDelivered, selectByPlacedby, changeDestination,
  changeLocation, selectAllParcels, updateStatus, selectByParcelId, selectByPlacedbyAndId,
} from '../utility/queries';

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

      const values = [placedBy, weight, moment().format('MMMM Do YYYY, h:mm:ss a'),
        location, location, destination, distance, price];

      const { rows: [parcel] } = await db(createOrder, values);

      delete parcel.placed_by;
      delete parcel.weight_metric;
      delete parcel.distance_metric;

      parcel.distance = `${parcel.distance} km`;
      parcel.weight = `${parcel.weight} kg`;

      return res.status(201).json({ status: 201, message: 'order created', parcel });
    } catch (error) {
      res.status(500).json({ status: 500, error });
    }
  }

  /**
   * Fetch all parcel delivery orders for a particular user.
   * @param {object} req the request object.
   * @param {object} res the response object.
   */
  static async fetchAllOrdersForUser(req, res) {
    try {
      const { rows: orders, rowCount: count } = await db(selectByPlacedby, [req.user]);
      return res.status(200).json({ status: 200, count, orders });
    } catch (error) {
      res.status(500).json({ status: 500, error });
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
        params: { parcelId: id },
        body: { destination: newDestination, distance, price: additionalPrice }
      } = req;
      await db(changeDestination, [newDestination, distance, id]);
      const newDistance = `${distance} km`;
      const message = 'parcel destination updated';
      return res.status(200).json({
        status: 200, id, message, newDestination, newDistance, additionalPrice,
      });
    } catch (error) {
      res.status(500).json({ status: 500, error });
    }
  }

  /**
   * Change the location of a parcel.
   * @param {object} req the request object.
   * @param {object} res the response object.
   */
  static async changeLocation(req, res) {
    try {
      const {
        params: { parcelId: id },
        body: { distance, location: currentLocation }
      } = req;
      await db(changeLocation, [currentLocation, distance, id]);
      const newDistance = `${distance} km`;
      const message = 'parcel location updated';
      return res.status(200).json({
        status: 200, id, currentLocation, message, newDistance,
      });
    } catch (error) {
      res.status(500).json({ status: 500, error });
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
        return res.status(401).json({ status: 401, error: 'Unauthorized' });
      }
      const { rows: orders, rowCount: count } = await db(selectAllParcels);
      res.status(200).json({ status: 200, count, orders });
    } catch (error) {
      res.status(500).json({ status: 500, error });
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
      const { body: { status: newStatus }, params: { parcelId: id } } = req;
      const {
        rows: [parcel], rows: [{ status: existingStatus }]
      } = await db(selectByParcelId, [id]);
      const rejectIf = ['cancelled', 'delivered'];
      if (!parcel || rejectIf.includes(existingStatus)) {
        return res.status(409).json({ status: 409, error: 'invalid request' });
      }

      const update = newStatus === 'delivered' ? updateToDelivered : updateStatus;
      const values = newStatus === 'delivered'
        ? [newStatus, id, moment().format('MMMM Do YYYY, h:mm:ss a')]
        : [newStatus, id];

      const message = 'parcel status changed';
      await db(update, values);
      return res.status(200).json({
        status: 200, id, newStatus, message,
      });
    } catch (error) {
      res.status(500).json({ status: 500, error });
    }
  }

  /**
   * Fetch a parcel delivery order by Id.
   * @param {object} req the request object.
   * @param {object} res the response object.
   */
  static async fetchParcelById(req, res) {
    try {
      const { params: { parcelId }, user: id } = req;
      const { rows: [parcel] } = await db(selectByPlacedbyAndId, [id, parcelId]);
      if (parcel) {
        delete (parcel.placed_by);
        return res.status(200).json({ status: 200, parcel });
      }
      return res.status(404).json({ status: 404, error: 'invalid ID' });
    } catch (error) {
      res.status(500).json({ status: 500, error });
    }
  }

  /**
   * Cancel a parcel delivery order.
   * @param {object} req the request object.
   * @param {object} res the response object.
   */
  static async cancelOrder(req, res) {
    try {
      const { params: { parcelId }, user: id } = req;
      const { rows: [parcel] } = await db(selectByPlacedbyAndId, [id, parcelId]);
      if (!parcel) {
        return res.status(404).json({ status: 404, error: 'None of your parcels match that ID, Please crosscheck.' });
      }
      if (parcel.status === 'delivered') {
        return res.status(409).json({ status: 409, error: 'That parcel has already been delivered' });
      }
      await db(updateStatus, ['cancelled', parcelId]);
      return res.status(200).send({ status: 200, parcelId, message: 'order cancelled' });
    } catch (error) {
      res.status(500).json({ status: 500, error });
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
        return res.status(401).json({ status: 401, error: 'Unauthorized' });
      }
      const { userId } = req.params;
      const { rows: orders, rowCount: count } = await db(selectByPlacedby, [userId]);
      if (orders[0]) {
        return res.status(200).json({ status: 200, count, orders });
      }
      return res.status(200).json({
        status: 200,
        message: 'No Orders to retrieve',
      });
    } catch (error) {
      res.status(500).json({ status: 500, error });
    }
  }
}

export default ParcelController;
