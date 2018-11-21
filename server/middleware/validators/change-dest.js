import { errorSelector, isValid } from '../../helpers/validator';
import checkOrder from './create-order';

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
      : res.status(400).send({ error: 'Empty field.' });
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
    if (!isValid(req.body.destination).valid) {
      return res.status(400).send(
        errorSelector(isValid(req.body.destination).reason, 'destination'),
      );
    }
    return next();
  }
}


export default [check.isComplete, check.general, checkOrder[3]];
