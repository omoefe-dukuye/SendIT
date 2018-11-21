/* eslint-disable no-console */
import 'babel-polyfill';
import moment from 'moment';
import db from '../../utility/dbconnect';
import help from '../../helpers/user';

const create = (firstName, lastName, password, email, username, admin) => {
  (async () => {
    const hashPassword = help.hashPassword(password);

    const createQuery = `INSERT INTO
      users(first_name, last_name, email, username, is_admin, password, registered)
      VALUES($1, $2, $3, $4, $5, $6, $7)
      returning *`;
    const values = [
      firstName,
      lastName,
      email,
      username,
      admin,
      hashPassword,
      moment().format('MMMM Do YYYY, h:mm:ss a'),
    ];
    const { rows } = await db(createQuery, values);
    const token = help.generateToken(rows[0].id);
    return token;
  })();
};

export default () => create('Chubi', 'Best', 'chubibest', 'chubi.best@gmail.com', 'chubibest', true);
