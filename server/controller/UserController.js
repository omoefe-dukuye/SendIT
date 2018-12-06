import 'babel-polyfill';
import moment from 'moment';
import db from '../config/dbconnect';
import help from '../helpers/user';
import {
  createUser, selectById, upgradeToAdmin, selectByUsername,
} from '../utility/queries';

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
      const values = [
        firstName, lastName, otherNames, mail, userName, hashPassword,
        moment().format('MMMM Do YYYY, h:mm:ss a'),
      ];
      const {
        rows: [user], rows: [{
          id, first_name: userFirstName, last_name: userLastName,
          username, email, is_admin: isAdmin,
        }]
      } = await db(createUser, values);
      const token = help.generateToken({
        id, userFirstName, userLastName, username, email, isAdmin,
      });
      delete user.password;
      if (user.other_names === null) {
        delete user.other_names;
      }
      return res.status(201).header('x-auth', token).json({ status: 201, token, user });
    } catch (error) { res.status(500).json({ status: 500, error }); }
  }

  /**
   * Upgrade a user to admin.
   * @param {object} req the request object.
   * @param {object} res the response object.
   */
  static async createAdmin(req, res) {
    const { params: { userId: id }, body: { password } } = req;
    const { ADMIN_PASS: adminPass } = process.env;
    if (password !== adminPass) {
      return res.status(401).json({ status: 401, error: 'Invalid admin key' });
    }
    try {
      const { rows } = await db(selectById, [id]);
      if (!rows[0]) {
        return res.status(400).json({ status: 400, message: 'Invalid id' });
      }
      await db(upgradeToAdmin, ['yes', id]);
      return res.status(200).json({
        status: 200,
        message: `User with the id '${id}' has been upgraded to admin`,
      });
    } catch (error) {
      res.status(500).json({ status: 500, error });
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
      const {
        rows: [user], rows: [{
          id, first_name: userFirstName, last_name: userLastName, email,
          password: existingPassword, is_admin: isAdmin,
        }]
      } = await db(selectByUsername, [username]);
      if (!user || !help.comparePassword(existingPassword, suppliedPassword)) {
        return res.status(404).json({ error: 404, message: 'invalid credentials' });
      }
      const token = help.generateToken({
        id, userFirstName, userLastName, username, email, isAdmin,
      });
      delete (user.password);
      if (user.other_names === null) {
        delete user.other_names;
      }
      return res.status(200).header('x-auth', token).json({ status: 200, token, user });
    } catch (error) {
      res.status(404).json({ status: 404, message: 'invalid credentials' });
    }
  }
}
export default UserController;
