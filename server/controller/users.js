import 'babel-polyfill';
import moment from 'moment';
import uuidv4 from 'uuid/v4';
import db from '../utility/dbconnect';
import help from '../helpers/user';

export default {
  create: (req, res) => {
    (async () => {
      const hashPassword = help.hashPassword(req.body.password);

      const createQuery = `INSERT INTO
        users(id, email, password, created_date)
        VALUES($1, $2, $3, $4)
        returning *`;
      const values = [
        uuidv4(),
        req.body.email,
        hashPassword,
        moment().format('MMMM Do YYYY, h:mm:ss a'),
      ];

      const { rows } = await db(createQuery, values);
      const token = help.generateToken(rows[0].id);
      return res.status(201).header('x-auth', token).send('Account created');
    })().catch(e => res.status(400).send(
      e.routine === '_bt_check_unique'
        ? 'Email already in use'
        : e,
    ));
  },

  login: (req, res) => {
    (async () => {
      const text = 'SELECT * FROM users WHERE email = $1';
      const { rows } = await db(text, [req.body.email]);
      if (!rows[0] || !help.comparePassword(rows[0].password, req.body.password)) {
        return res.status(400).send('incorrect credentials');
      }
      const token = help.generateToken(rows[0].id);
      return res.status(200).header('x-auth', token).send('Welcome');
    })().catch(e => res.status(400).send(e));
  },
};
