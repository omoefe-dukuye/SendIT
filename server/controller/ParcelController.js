import 'babel-polyfill';
import moment from 'moment';
import db from '../config/dbconnect';
import { isAddress } from '../helpers/validator';
import {
  createOrder, updateToDelivered, selectByPlacedby, changeDestination, selectById,
  changeLocation, selectAllParcels, updateStatus, selectByParcelId, selectByPlacedbyAndId,
} from '../utility/queries';
import mailer from '../helpers/mailer';
import messages from '../helpers/emailMessages';

const { location: locationMail, status: statusMail } = messages;

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
      const placedBy = req.user.id;

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
      const { rows: orders, rowCount: count } = await db(selectByPlacedby, [req.user.id]);
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
        body: { distance, location: currentLocation },
      } = req;

      const {
        rows: [{ placed_by: owner }]
      } = await db(changeLocation, [currentLocation, distance, id]);

      const newDistance = `${distance} km`;
      const message = 'parcel location updated';
      res.status(200).json({
        status: 200, id, currentLocation, message, newDistance,
      });
      const { rows: [{ first_name: name, email: to }] } = await db(selectById, [owner]);
      const email = locationMail(currentLocation, id, name);
      email.to = to;
      mailer(email);
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
      if (!req.user.admin) {
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
      if (!req.user.admin) {
        return res.status(401).json({ status: 401, error: 'Unauthorized' });
      }
      const {
        body: { status: newStatus }, params: { parcelId: id },
      } = req;
      const { rows: [parcel] } = await db(selectByParcelId, [id]);
      if (!parcel) {
        return res.status(400).json({ status: 400, error: 'No parcels match that ID, please crosscheck.' });
      }

      const { status: existingStatus } = parcel;
      const rejectIf = ['cancelled', 'delivered'];
      if (rejectIf.includes(existingStatus)) {
        return res.status(409).json({ status: 409, error: `That parcel has already been ${existingStatus}` });
      }

      const update = newStatus === 'delivered' ? updateToDelivered : updateStatus;
      const values = newStatus === 'delivered'
        ? [newStatus, id, moment().format('MMMM Do YYYY, h:mm:ss a')]
        : [newStatus, id];

      const message = 'parcel status changed';

      const { rows: [{ placed_by: owner }] } = await db(update, values);

      res.status(200).json({
        status: 200, id, newStatus, message,
      });

      const toGetMail = ['in-transit', 'delivered'];
      if (toGetMail.includes(newStatus)) {
        const { rows: [{ first_name: name, email: to }] } = await db(selectById, [owner]);
        const email = statusMail(id, name, newStatus);
        email.to = to;
        mailer(email);
      }
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
    const { params: { parcelId }, user: { id, admin } } = req;
    const query = admin ? selectByParcelId : selectByPlacedbyAndId;
    const values = admin ? [parcelId] : [parcelId, id];
    let parcel;
    try {
      const { rows: [order] } = await db(query, values);
      parcel = order;
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: 500, error });
    }
    if (!parcel) {
      return res.status(404).json({ status: 404, error: `No${!admin ? 'ne of your' : ''} parcels match that ID, please crosscheck.` });
    }
    const { pickup_location: from, current_location: location, destination: to } = parcel;
    try {
      const { coords: pickupCoords } = await isAddress(from);
      const { coords: locationCoords } = await isAddress(location);
      const { coords: destinationCoords } = await isAddress(to);

      parcel.coords = [pickupCoords, locationCoords, destinationCoords];
      if (!admin) delete parcel.placed_by;
      res.status(200).json({ status: 200, parcel });
    } catch (err) {
      res.status(400).json({ status: 400, error: 'Network error, Please check your connection' });
    }
  }

  /**
   * Cancel a parcel delivery order.
   * @param {object} req the request object.
   * @param {object} res the response object.
   */
  static async cancelOrder(req, res) {
    try {
      const { params: { parcelId }, user: { id } } = req;
      const { rows: [parcel] } = await db(selectByPlacedbyAndId, [parcelId, id]);
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
      if (!req.user.admin) {
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
