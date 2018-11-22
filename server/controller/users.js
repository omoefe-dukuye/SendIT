/* eslint-disable camelcase */
import 'babel-polyfill';
import moment from 'moment';
import db from '../utility/dbconnect';
import help from '../helpers/user';

export default {
  /**
   * Create a user.
   * @param {object} req the request object.
   * @param {object} res the response object.
   */
  create: (req, res) => {
    (async () => {
      const hashPassword = help.hashPassword(req.body.password);

      const {
        firstName, lastName, otherNames, email: mail, username: userName,
      } = req.body;

      const createQuery = `INSERT INTO
        users(first_name, last_name, other_names, email, username, password, registered)
        VALUES($1, $2, $3, $4, $5, $6, $7)
        returning *`;
      const values = [
        firstName,
        lastName,
        otherNames,
        mail,
        userName,
        hashPassword,
        moment().format('MMMM Do YYYY, h:mm:ss a'),
      ];

      const {
        rows: [user], rows: [{
          id, first_name, last_name, username, email,
        }]
      } = await db(createQuery, values);
      const token = help.generateToken({
        id, first_name, last_name, username, email,
      });
      delete (user.password);
      return res.status(201).header('x-auth', token).json({
        status: 201,
        data: [{
          token,
          user,
        }],
      });
    })().catch(() => res.status(409).json({
      status: 409,
      message: 'Email already in use',
    }));
  },

  /**
   * Log in a user.
   * @param {object} req the request object.
   * @param {object} res the response object.
   */
  login: (req, res) => {
    (async () => {
      const { username, password: suppliedPassword } = req.body;
      const text = 'SELECT * FROM users WHERE username = $1';

      const {
        rows: [user], rows: [{
          id, first_name, last_name, email, password: existingPassword,
        }]
      } = await db(text, [username]);

      if (!user || !help.comparePassword(existingPassword, suppliedPassword)) {
        return res.status(400).json({
          error: 400,
          message: 'incorrect credentials',
        });
      }
      const token = help.generateToken({
        id, first_name, last_name, username, email,
      });

      delete (user.password);
      return res.status(200).header('x-auth', token).json({
        status: 200,
        data: [{
          token,
          user,
        }],
      });
    })().catch(() => res.status(404).json({
      status: 404,
      message: 'invalid credentials',
    }));
  },
};
