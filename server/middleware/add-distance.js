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
      const query = 'SELECT * FROM parcels WHERE id = $1';
      const { rows } = await db(query, [req.params.parcelId]);
      if (!rows[0] || rows[0].status === 'cancelled') {
        return res.status(404).send({ error: 'Order non-existent or cancelled' });
      }

      const { destination } = rows[0];

      return isAddress(destination, (address, error, coords) => {
        const destinationCoords = { lat: coords.lat, lng: coords.lng };

        req.body.distance = `${Math.round(
          computeDistance(req.body.locationCoords, destinationCoords),
        )} km`;

        return next();
      });
    })().catch((error) => {
      res.status(400).send({ error });
    });
  }

  if (req.body.destinationCoords) {
    (async () => {
      const query = 'SELECT * FROM parcels WHERE sender_id = $1 AND id = $2';
      const { rows } = await db(query, [req.user.id, req.params.parcelId]);
      if (!rows[0] || rows[0].status === 'cancelled') {
        return res.status(404).send({ error: 'Order non-existent or cancelled' });
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
    })().catch((error) => {
      res.status(400).send({ error });
    });
  }
  return undefined;
};

export default addDistance;
