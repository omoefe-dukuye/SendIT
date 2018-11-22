import { isEmail, isAlphanumeric } from 'validator';
import db from '../../config/dbconnect';

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
  const requiredFields = [email, password, firstName, lastName, username];
  if (requiredFields.includes(undefined)) {
    const required = ['Email', 'Password', 'First Name', 'Last Name', 'Username'];
    const i = requiredFields.indexOf(undefined);
    return res.status(400).json({
      status: 400,
      error: `The '${required[i]}' field seems to be empty.`
    });
  }
  if (!isEmail(email)) {
    return res.status(400).json({
      status: 400,
      message: 'Please use a valid Email Address.',
    });
  }
  if (!isAlphanumeric(username)) {
    return res.status(400).json({
      status: 400,
      message: 'Please use alphabets and numbers for your Username.',
    });
  }
  if (username.length < 4) {
    return res.status(400).json({
      status: 400,
      message: 'Please use a Username longer than 4 characters.',
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
    return res.status(409).json({ status: 409, error: 'This Username is already taken, try something else' });
  }
  return next();
};
