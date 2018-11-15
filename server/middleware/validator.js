import validator from 'validator';
import { errorSelector, isValid, isAddress } from '../helpers/validatorhelp';

const isComplete = (req, res, next) => {
  if (req.body.location && req.body.destination && req.body.email && req.body.description) {
    return next();
  }
  return res.status(400).send('Please fill all fields.');
};

const checkDetails = (req, res, next) => {
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
};

const checkLocation = (req, res, next) => {
  isAddress(req.body.location, (address, error, lat, lng) => {
    if (address) {
      req.body.location = address;
      req.body.locationCoords = { lat, lng };
      next();
    } else {
      const msg = error === 1 ? 'Network error' : 'Invalid location';
      res.status(400).send(msg);
    }
  });
};

const checkDestination = (req, res, next) => {
  isAddress(req.body.destination, (address, error, lat, lng) => {
    if (address) {
      req.body.destination = address;
      req.body.destinationCoords = { lat, lng };
      next();
    } else {
      const msg = error === 1 ? 'Network error' : 'Invalid destination';
      res.status(400).send(msg);
    }
  });
};

export {
  isComplete, checkDetails, checkLocation, checkDestination,
};
