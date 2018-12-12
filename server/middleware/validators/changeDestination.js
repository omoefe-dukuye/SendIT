import { errorSelector, isValid } from '../../helpers/validator';
import checkOrder from './createOrder';

/** class representing checks for destination change */
class check {
  /**
   * Checks if destination is present.
   * @param {Object} req the request object.
   * @param {Object} res the response object.
   * @param {Function} next calls the next middleware
   * @return {Object} the error object if tests fail
   * @return {Function} calls the next middleware if test passes
   */
  static isComplete(req, res, next) {
    return req.body.destination
      ? next()
      : res.status(400).json({ error: 'Please fill the new Destination.' });
  }

  /**
   * Checks if destination is present.
   * @param {Object} req the request object.
   * @param {Object} res the response object.
   * @param {Function} next calls the next middleware
   * @return {Object} the error object if tests fail
   * @return {Function} calls the next middleware if test passes
   */
  static general(req, res, next) {
    const { destination } = req.body;
    if (!isValid(destination).valid) {
      return res.status(400).json({
        error: errorSelector(isValid(destination).reason, 'destination'),
      });
    }
    return next();
  }
}


export default [check.isComplete, check.general, checkOrder[3]];
