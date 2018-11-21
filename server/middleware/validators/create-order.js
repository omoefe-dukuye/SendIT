import { errorSelector, isValid, isAddress } from '../../helpers/validator';

class check {
  static isComplete(req, res, next) {
    return req.body.location && req.body.destination && req.body.weight
      ? next()
      : res.status(400).send('Please fill all fields.');
  }

  static general(req, res, next) {
    if (!isValid(req.body.location).valid) {
      res.status(400).json({
        status: 400,
        message: errorSelector(isValid(req.body.destination).reason, 'location'),
      });
    } else if (!isValid(req.body.destination).valid) {
      res.status(400).json({
        status: 400,
        message: errorSelector(isValid(req.body.destination).reason, 'destination'),
      });
    } else if (Number.isNaN(Number(req.body.weight))) {
      res.status(400).json({
        status: 400,
        message: 'Use numbers for weight',
      });
    } else {
      next();
    }
  }

  static location(req, res, next) {
    isAddress(req.body.location, (address, error, coords) => {
      if (address) {
        req.body.location = address;
        req.body.locationCoords = { lat: coords.lat, lng: coords.lng };
        next();
      } else {
        res.status(400).json({
          status: 400,
          message: error,
        });
      }
    });
  }

  static destination(req, res, next) {
    isAddress(req.body.destination, (address, error, coords) => {
      if (address) {
        req.body.destination = address;
        req.body.destinationCoords = { lat: coords.lat, lng: coords.lng };
        next();
      } else {
        res.status(400).json({
          status: 400,
          message: error,
        });
      }
    });
  }
}


export default [check.isComplete, check.general, check.location, check.destination];
