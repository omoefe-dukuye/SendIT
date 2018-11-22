import { isEmail, isAlphanumeric } from 'validator';
import db from '../../utility/dbconnect';

/**
   * Check fields for order creation.
   * @param {Object} req the request object.
   * @param {Object} res the response object.
   * @param {Function} next calls the next middleware
   * @return {Object} the error object if tests fail
   * @return {Function} calls the next middleware if test passes
   */
export default async (req, res, next) => {
  const {
    email, password, firstName, lastName, username,
  } = req.body;
  if (!email || !password || !firstName || !lastName || !username) {
    return res.status(400).send('Please fill all fields.');
  }
  if (!isEmail(email)) {
    return res.status(400).json({
      status: 400,
      message: 'invalid email',
    });
  }
  if (!isAlphanumeric(username)) {
    return res.status(400).json({
      status: 400,
      message: 'use alphanumeric username',
    });
  }
  if (password.length < 6) {
    return res.status(400).json({
      status: 400,
      message: 'Password should be longer than 5 characters.',
    });
  }
  const text = 'SELECT * FROM users WHERE username = $1';
  const { rows: [exists] } = await db(text, [username]);
  if (exists) {
    return res.status(409).json({ status: 409, error: 'username already taken' });
  }
  return next();
};
