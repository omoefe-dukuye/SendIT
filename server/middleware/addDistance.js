import 'babel-polyfill';
import computeDistance from '../helpers/distance';
import { isAddress } from '../helpers/validator';
import db from '../config/dbconnect';

const rejectIf = ['cancelled', 'delivered'];

/**
   * Add distance to valid address input.
   * @param {Object} req the request object.
   * @param {Object} res the response object.
   * @param {Function} next calls the next middleware
   * @return {Object} the error object if tests fail
   * @return {Function} calls the next middleware if test passes,
   * after adding the distance to the response body
   */
const addDistance = async (req, res, next) => {
  const {
    user: userId,
    params: { parcelId },
    body: { locationCoords, destinationCoords },
    admin,
  } = req;
  if (locationCoords && destinationCoords) {
    req.body.distance = Math.round(
      computeDistance(locationCoords, destinationCoords),
    );
    return next();
  }
  if (locationCoords) {
    if (!admin) {
      return res.status(401).send({ status: 401, error: 'Unauthorized' });
    }
    const query = 'SELECT * FROM parcels WHERE id = $1';
    const { rows: [parcel], rows: [{ destination, status }] } = await db(query, [parcelId]);

    if (!parcel || rejectIf.includes(status)) {
      return res.status(404).json({ status: 404, error: `The parcel has already been ${status}` });
    }

    return isAddress(destination, (address, error, coords) => {
      const existingDestinationCoords = { lat: coords.lat, lng: coords.lng };

      req.body.distance = Math.round(
        computeDistance(locationCoords, existingDestinationCoords),
      );

      return next();
    });
  }

  if (destinationCoords) {
    const query = 'SELECT * FROM parcels WHERE placed_by = $1 AND id = $2';
    const {
      rows: [parcel], rows: [{ current_location: currentLocation, weight, status }]
    } = await db(query, [
      userId, parcelId,
    ]);

    if (!parcel || rejectIf.includes(status)) {
      return res.status(404).json({ status: 404, error: `The parcel has already been ${status}` });
    }

    return isAddress(currentLocation, (address, error, coords) => {
      const currentLocationCoords = { lat: coords.lat, lng: coords.lng };

      req.body.distance = Math.round(
        computeDistance(currentLocationCoords, destinationCoords),
      );

      req.body.weight = weight;
      return next();
    });
  }
};

export default addDistance;
