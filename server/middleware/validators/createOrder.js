import { errorSelector, isValid, isAddress } from '../../helpers/validator';

/** class representing checks for input sent while creating order */
class check {
  /**
   * Check if all fields are filled.
   * @param {Object} req the request object.
   * @param {Object} res the response object.
   * @param {Function} next calls the next middleware
   * @return {Object} the error object if tests fail
   * @return {Function} calls the next middleware if test passes
   */
  static isComplete(req, res, next) {
    const { location, destination, weight } = req.body;
    const requiredFields = [location, destination, weight];
    if (requiredFields.includes(undefined)) {
      const required = [
        'location where the parcel will be picked up from',
        'destination where the parcel will be delivered to',
        'parcel weight',
      ];
      const i = requiredFields.indexOf(undefined);
      return res.status(400).json({
        status: 400,
        error: `Please enter the ${required[i]}.`
      });
    }
    next();
  }

  /**
   * Run preliminary checks for valid input.
   * @param {Object} req the request object.
   * @param {Object} res the response object.
   * @param {Function} next calls the next middleware
   * @return {Function} Sends the adequate error message
   */
  static general(req, res, next) {
    const { location, destination } = req.body;
    req.body.weight = req.body.weight.trim();
    const { weight } = req.body;
    if (!isValid(location).valid) {
      return res.status(400).json({
        status: 400,
        error: errorSelector(isValid(location).reason, 'location'),
      });
    }
    if (!isValid(destination).valid) {
      return res.status(400).json({
        status: 400,
        error: errorSelector(isValid(destination).reason, 'destination'),
      });
    }
    if (weight.length < 1) {
      return res.status(400).json({
        status: 400,
        error: 'Please add weight.',
      });
    }
    if (Number.isNaN(Number(weight))) {
      return res.status(400).json({
        status: 400,
        error: 'Use numbers for weight.',
      });
    }
    if (weight <= 0) {
      return res.status(400).json({
        status: 400,
        error: 'Weight cannot be zero or less.',
      });
    }
    next();
  }

  /**
   * Check if location exists on google api.
   * @param {Object} req the request object.
   * @param {Object} res the response object.
   * @param {Function} next calls the next middleware
   */
  static async location(req, res, next) {
    const { location } = req.body;
    try {
      const { formattedAddress: address, coords } = await isAddress(location);
      req.body.location = address;
      req.body.locationCoords = coords;
    } catch (err) {
      const error = err.message === 1
        ? 'Network error, Please check your connection'
        : 'The address for your pickup location doesn\'t seem to exist, Please crosscheck';
      res.status(400).json({ status: 400, error });
    }
    next();
  }

  /**
   * Check if destination exists on google api.
   * @param {Object} req the request object.
   * @param {Object} res the response object.
   * @param {Function} next calls the next middleware
   */
  static async destination(req, res, next) {
    const { destination } = req.body;
    try {
      const { formattedAddress: address, coords } = await isAddress(destination);
      req.body.destination = address;
      req.body.destinationCoords = coords;
    } catch (err) {
      const error = err.message === 1
        ? 'Network error, Please check your connection'
        : 'The address for your destination doesn\'t seem to exist, Please crosscheck';
      res.status(400).json({ status: 400, error });
    }
    next();
  }
}


export default [check.isComplete, check.general, check.location, check.destination];
