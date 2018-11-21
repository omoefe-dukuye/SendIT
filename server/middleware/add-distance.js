import 'babel-polyfill';
import computeDistance from '../helpers/distance';
import { isAddress } from '../helpers/validator';
import db from '../utility/dbconnect';

const addDistance = (req, res, next) => {
  if (req.body.locationCoords && req.body.destinationCoords) {
    req.body.distance = `${Math.round(
      computeDistance(req.body.locationCoords, req.body.destinationCoords),
    )} km`;
    return next();
  }
  if (req.body.locationCoords) {
    (async () => {
      if (!req.admin) {
        return res.status(401).send({ status: 401, error: 'Unauthorized' });
      }
      const query = 'SELECT * FROM parcels WHERE id = $1';
      const { rows } = await db(query, [req.params.parcelId]);
      if (!rows[0] || rows[0].status === 'cancelled' || rows[0].status === 'delivered') {
        return res.status(404).json({ status: 404, error: 'invalid request' });
      }

      const { destination } = rows[0];

      return isAddress(destination, (address, error, coords) => {
        const destinationCoords = { lat: coords.lat, lng: coords.lng };

        req.body.distance = `${Math.round(
          computeDistance(req.body.locationCoords, destinationCoords),
        )} km`;

        return next();
      });
    })();
  }

  if (req.body.destinationCoords) {
    (async () => {
      const query = 'SELECT * FROM parcels WHERE placed_by = $1 AND id = $2';
      const { rows } = await db(query, [req.user.id, req.params.parcelId]);
      if (!rows[0] || rows[0].status === 'cancelled' || rows[0].status === 'delivered') {
        return res.status(404).json({ status: 404, error: 'invalid request' });
      }
      // eslint-disable-next-line camelcase
      const { current_location } = rows[0];

      return isAddress(current_location, (address, error, coords) => {
        const locationCoords = { lat: coords.lat, lng: coords.lng };

        req.body.distance = `${Math.round(
          computeDistance(locationCoords, req.body.destinationCoords),
        )} km`;

        return next();
      });
    })();
  }
  return undefined;
};

export default addDistance;
