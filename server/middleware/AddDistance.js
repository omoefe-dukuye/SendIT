import 'babel-polyfill';
import computeDistance from '../helpers/distance';
import { isAddress } from '../helpers/validator';
import db from '../config/dbconnect';
import { selectByPlacedbyAndId, selectByParcelId } from '../utility/queries';

const rejectIf = ['cancelled', 'delivered'];

/**
 * Class for adding distance to response
 */
class AddDistance {
  /**
   * Add distance to valid address input.
   * @param {Object} req the request object.
   * @param {Object} res the response object.
   * @param {Function} next calls the next middleware
   * @return {Function} calls the next middleware if test passes,
   * after adding the distance to the response body
   */
  static async forCreatedOrder(req, res, next) {
    const { body: { locationCoords, destinationCoords } } = req;
    req.body.distance = Math.round(computeDistance(locationCoords, destinationCoords));
    return next();
  }

  /**
   * Add distance to valid address input.
   * @param {Object} req the request object.
   * @param {Object} res the response object.
   * @param {Function} next calls the next middleware
   * @return {Object} the error object if tests fail
   * @return {Function} calls the next middleware if test passes,
   * after adding the distance to the response body
   */
  static async forLocationChange(req, res, next) {
    const { params: { parcelId }, body: { locationCoords }, user: { admin } } = req;
    if (!admin) {
      return res.status(401).send({ status: 401, error: 'Unauthorized' });
    }
    let parcel;
    try {
      const { rows: [order] } = await db(selectByParcelId, [parcelId]);
      parcel = order;
    } catch (error) {
      return res.status(500).json({ status: 500, error });
    }
    if (!parcel) {
      return res.status(404).json({ status: 404, error: 'No parcels match that ID, Please crosscheck.' });
    }
    const { destination, status } = parcel;
    if (rejectIf.includes(status)) {
      return res.status(409).json({ status: 409, error: `The parcel has already been ${status}.` });
    }
    try {
      const { coords: existingDestinationCoords } = await isAddress(destination);
      req.body.distance = Math.round(computeDistance(locationCoords, existingDestinationCoords));
      next();
    } catch (err) {
      res.status(400).json({ status: 400, error: 'Network error, Please check your connection' });
    }
  }

  /**
   * Add distance to valid address input.
   * @param {Object} req the request object.
   * @param {Object} res the response object.
   * @param {Function} next calls the next middleware
   * @return {Object} the error object if tests fail
   * @return {Function} calls the next middleware if test passes,
   * after adding the distance to the response body
   */
  static async forDestinationChange(req, res, next) {
    const { user: { id: userId }, params: { parcelId }, body: { destinationCoords } } = req;
    let parcel;
    try {
      const { rows: [order] } = await db(selectByPlacedbyAndId, [parcelId, userId]);
      parcel = order;
    } catch (error) {
      return res.status(500).json({ status: 500, error });
    }
    if (!parcel) {
      return res.status(404).json({ status: 404, error: 'None of your parcels match that ID, Please crosscheck.' });
    }
    const { current_location: currentLocation, weight, status } = parcel;
    if (rejectIf.includes(status)) {
      return res.status(409).json({ status: 409, error: `That parcel has already been ${status}.` });
    }
    try {
      const { coords: currentLocationCoords } = await isAddress(currentLocation);
      req.body.distance = Math.round(computeDistance(currentLocationCoords, destinationCoords));
      req.body.weight = weight;
      next();
    } catch (err) {
      res.status(400).json({ status: 400, error: 'Network error, Please check your connection' });
    }
  }
}

export default AddDistance;
