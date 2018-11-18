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
      const id = req.params.parcelId;
      const { rows } = await db(query, [id]);
      if (!rows[0]) {
        return res.status(404).send({ error: 'Invalid ID' });
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
      const query = 'SELECT * FROM parcels WHERE id = $1';
      const id = req.params.parcelId;
      const { rows } = await db(query, [id]);
      if (!rows[0]) {
        return res.status(404).send({ error: 'Invalid ID' });
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
