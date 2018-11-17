import validator from 'validator';
import { errorSelector, isValid, isAddress } from '../helpers/validatorhelp';

class check {
  static isComplete(req, res, next) {
    return req.body.location && req.body.destination && req.body.email && req.body.description
      ? next()
      : res.status(400).send('Please fill all fields.');
  }

  static general(req, res, next) {
    if (!isValid(req.body.location).valid) {
      res.status(400).send(
        errorSelector(isValid(req.body.location).reason, 'LOCATION'),
      );
    } else if (!isValid(req.body.destination).valid) {
      res.status(400).send(
        errorSelector(isValid(req.body.location).reason, 'DESTINATION'),
      );
    } else if (!isValid(req.body.description).valid) {
      res.status(400).send(
        errorSelector(isValid(req.body.location).reason, 'DESCRIPTION'),
      );
    } else if (!validator.isEmail(req.body.email)) {
      res.status(400).send('Please enter valid email');
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
        const msg = error === 1 ? 'Network error' : 'Invalid location';
        res.status(400).send(msg);
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
        const msg = error === 1 ? 'Network error' : 'Invalid destination';
        res.status(400).send(msg);
      }
    });
  }
}


export default check;
