import { isEmail } from 'validator';

/**
   * Check fields for order creation.
   * @param {Object} req the request object.
   * @param {Object} res the response object.
   * @param {Function} next calls the next middleware
   * @return {Object} the error object if tests fail
   * @return {Function} calls the next middleware if test passes
   */
export default (req, res, next) => {
  if (!req.body.email || !req.body.password || !req.body.firstName
    || !req.body.lastName || !req.body.username) {
    return res.status(400).send('Please fill all fields.');
  }
  if (!isEmail(req.body.email)) {
    return res.status(400).json({
      status: 400,
      message: 'invalid email',
    });
  }
  if (req.body.password.length < 6) {
    return res.status(400).json({
      status: 400,
      message: 'Password should be longer than 5 characters.',
    });
  }
  return next();
};
