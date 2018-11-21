import { errorSelector, isValid } from '../../helpers/validator';
import checkOrder from './create-order';

/** class representing checks for location change */
class check {
  /**
   * Check if location is present.
   * @param {Object} req the request object.
   * @param {Object} res the response object.
   * @param {Function} next calls the next middleware
   * @return {Object} the error object if tests fail
   * @return {Function} calls the next middleware if test passes
   */
  static isComplete(req, res, next) {
    const { location } = req.body;
    return location
      ? next()
      : res.status(400).send({ error: 'Empty field.' });
  }

  /**
   * Check if destination is valid.
   * @param {Object} req the request object.
   * @param {Object} res the response object.
   * @param {Function} next calls the next middleware
   * @return {Object} the error object if tests fail
   * @return {Function} calls the next middleware if test passes
   */
  static general(req, res, next) {
    const { location } = req.body;
    if (!isValid(location).valid) {
      return res.status(400).send(
        errorSelector(isValid(location).reason, 'destination'),
      );
    }
    return next();
  }
}


export default [check.isComplete, check.general, checkOrder[2]];
