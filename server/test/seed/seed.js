/* eslint-disable no-console */
import 'babel-polyfill';
import moment from 'moment';
import db from '../../utility/dbconnect';
import help from '../../helpers/user';

class User {
  constructor(firstName, lastName, username, email, password, admin) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.username = username;
    this.email = email;
    this.password = password;
    this.admin = admin;
  }
}

const create = (user) => {
  (async () => {
    const hashPassword = help.hashPassword(user.password);

    const createQuery = `INSERT INTO
      users(first_name, last_name, email, username, is_admin, password, registered)
      VALUES($1, $2, $3, $4, $5, $6, $7)
      returning *`;
    const values = [
      user.firstName,
      user.lastName,
      user.email,
      user.username,
      user.admin,
      hashPassword,
      moment().format('MMMM Do YYYY, h:mm:ss a'),
    ];
    const { rows } = await db(createQuery, values);
    const token = help.generateToken(rows[0].id);
    return token;
  })();
};

const admin = new User('Chubi', 'Best', 'chubibest', 'chubi.best@gmail.com', 'chubibest', true);

class users {
  static admin() {
    return create(admin);
  }
}

export default users;
