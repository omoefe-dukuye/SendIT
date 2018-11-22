import 'babel-polyfill';
import moment from 'moment';
import db from '../../config/dbconnect';
import help from '../../helpers/user';

const create = async (firstName, lastName, password, email, username, admin) => {
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
  await db(createQuery, values);
};

export default () => create('Chubi', 'Best', 'chubibest', 'chubi.best@gmail.com', 'chubibest', true);
