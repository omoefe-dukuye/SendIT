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
    const { params: { parcelId }, body: { locationCoords }, admin } = req;
    if (!admin) {
      return res.status(401).send({ status: 401, error: 'Unauthorized' });
    }

    const { rows: [parcel] } = await db(selectByParcelId, [parcelId]);

    if (!parcel) {
      return res.status(404).json({ status: 404, error: 'No parcels match that ID, Please crosscheck.' });
    }

    const { destination, status } = parcel;

    if (rejectIf.includes(status)) {
      return res.status(409).json({ status: 409, error: `The parcel has already been ${status}.` });
    }

    return isAddress(destination, (address, error, { lng, lat }) => {
      const existingDestinationCoords = { lng, lat };

      req.body.distance = Math.round(computeDistance(locationCoords, existingDestinationCoords));

      return next();
    });
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
    const { user: userId, params: { parcelId }, body: { destinationCoords } } = req;
    const { rows: [parcel] } = await db(selectByPlacedbyAndId, [userId, parcelId]);

    if (!parcel) {
      return res.status(404).json({ status: 404, error: 'None of your parcels match that ID, Please crosscheck.' });
    }

    const { current_location: currentLocation, weight, status } = parcel;

    if (rejectIf.includes(status)) {
      return res.status(409).json({ status: 409, error: `That parcel has already been ${status}.` });
    }

    return isAddress(currentLocation, (address, error, { lng, lat }) => {
      const currentLocationCoords = { lat, lng };

      req.body.distance = Math.round(computeDistance(currentLocationCoords, destinationCoords));

      req.body.weight = weight;
      return next();
    });
  }
}

export default AddDistance;
