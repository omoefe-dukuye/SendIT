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
    const required = ['email', 'password', 'firstName', 'lastName', 'username'];
    const i = requiredFields.indexOf(undefined);
    return res.status(400).json({
      status: 400,
      error: `The '${required[i]}' field seems to be empty.`
    });
  }
  req.body.firstName = req.body.firstName.trim();
  req.body.lastName = req.body.lastName.trim();
  req.body.username = req.body.username.trim();
  if (!(firstName.length > 1 && firstName.length < 20)) {
    return res.status(400).json({
      status: 400,
      error: 'Please use a first name between 2 and 20 characters',
    });
  }
  if (!/^[a-zA-Z']*$/.test(firstName)) {
    return res.status(400).json({
      status: 400,
      error: 'Only letters and apostrophes are allowed for first name',
    });
  }
  if (!(lastName.length > 1 && lastName.length < 20)) {
    return res.status(400).json({
      status: 400,
      error: 'Please use a last name between 2 and 20 characters',
    });
  }
  if (!/^[a-zA-Z']*$/.test(lastName)) {
    return res.status(400).json({
      status: 400,
      error: 'Only letters and apostrophes are allowed for last name',
    });
  }

  if (!isEmail(email)) {
    return res.status(400).json({
      status: 400,
      error: 'Please use a valid Email Address.',
    });
  }
  if (!isAlphanumeric(username)) {
    return res.status(400).json({
      status: 400,
      error: 'Please use letters and numbers for your username.',
    });
  }
  if (!(username.length > 3 && username.length < 20)) {
    return res.status(400).json({
      status: 400,
      error: 'Please use a username between 4 and 20 characters.',
    });
  }
  if (!(password.length > 4 && password.length < 20)) {
    return res.status(400).json({
      status: 400,
      error: 'Password should be between 5 and 20 characters.',
    });
  }
  if (password.indexOf(' ') > -1) {
    return res.status(400).json({
      status: 400,
      error: 'No use of spaces in password.',
    });
  }
  const text = 'SELECT * FROM users WHERE username = $1';
  const { rows: [usernameAlreadyExists] } = await db(text, [username]);
  if (usernameAlreadyExists) {
    return res.status(409).json({ status: 409, error: 'This Username is already taken, try something else' });
  }

  const query = 'SELECT * FROM users WHERE email = $1';
  const { rows: [emailAlreadyexists] } = await db(query, [email]);
  if (emailAlreadyexists) {
    return res.status(409).json({ status: 409, error: 'This email has already been used to open an account' });
  }

  return next();
};
