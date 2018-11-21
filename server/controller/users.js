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

      const createQuery = `INSERT INTO
        users(first_name, last_name, other_names, email, username, password, registered)
        VALUES($1, $2, $3, $4, $5, $6, $7)
        returning *`;
      const values = [
        req.body.firstName,
        req.body.lastName,
        req.body.otherNames,
        req.body.email,
        req.body.username,
        hashPassword,
        moment().format('MMMM Do YYYY, h:mm:ss a'),
      ];

      const { rows } = await db(createQuery, values);
      const token = help.generateToken(rows[0].id);
      delete (rows[0].password);
      return res.status(201).header('x-auth', token).json({
        status: 201,
        data: [{
          token,
          user: rows[0],
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
      const text = 'SELECT * FROM users WHERE email = $1';
      const { rows } = await db(text, [req.body.email]);
      if (!rows[0] || !help.comparePassword(rows[0].password, req.body.password)) {
        return res.status(400).json({
          error: 400,
          message: 'incorrect credentials',
        });
      }
      const token = help.generateToken(rows[0].id);
      return res.status(200).header('x-auth', token).json({
        status: 200,
        data: [{
          token,
          user: rows[0],
        }],
      });
    })();
  },
};
