import { errorSelector, isValid } from '../../helpers/validator';
import checkOrder from './create-order';

class check {
  static isComplete(req, res, next) {
    return req.body.location
      ? next()
      : res.status(400).send({ error: 'Empty field.' });
  }

  static general(req, res, next) {
    if (!isValid(req.body.location).valid) {
      return res.status(400).send(
        errorSelector(isValid(req.body.location).reason, 'destination'),
      );
    }
    return next();
  }
}


export default [check.isComplete, check.general, checkOrder[2]];
