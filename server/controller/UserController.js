import 'babel-polyfill';
import moment from 'moment';
import db from '../config/dbconnect';
import help from '../helpers/user';

/** Controller class for user signup and login */
class UserController {
  /**
   * Create a user.
   * @param {object} req the request object.
   * @param {object} res the response object.
   */
  static async createUser(req, res) {
    try {
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
          id, first_name: userFirstName, last_name: userLastName,
          username, email, is_admin: isAdmin,
        }]
      } = await db(createQuery, values);
      const token = help.generateToken({
        id, userFirstName, userLastName, username, email, isAdmin,
      });
      delete (user.password);
      return res.status(201).header('x-auth', token).json({
        status: 201,
        data: [{
          token,
          user,
        }],
      });
    } catch (error) {
      res.status(409).json({
        status: 409,
        message: 'Email already in use',
      });
    }
  }

  /**
   * Log in a user.
   * @param {object} req the request object.
   * @param {object} res the response object.
   */
  static async loginUser(req, res) {
    try {
      const { username, password: suppliedPassword } = req.body;
      const text = 'SELECT * FROM users WHERE username = $1';

      const {
        rows: [user], rows: [{
          id, first_name: userFirstName, last_name: userLastName, email,
          password: existingPassword, is_admin: isAdmin,
        }]
      } = await db(text, [username]);

      if (!user || !help.comparePassword(existingPassword, suppliedPassword)) {
        return res.status(404).json({
          error: 404,
          message: 'invalid credentials',
        });
      }
      const token = help.generateToken({
        id, userFirstName, userLastName, username, email, isAdmin,
      });

      delete (user.password);
      return res.status(200).header('x-auth', token).json({
        status: 200,
        data: [{
          token,
          user,
        }],
      });
    } catch (error) {
      res.status(404).json({
        status: 404,
        message: 'invalid credentials',
      });
    }
  }
}
export default UserController;
