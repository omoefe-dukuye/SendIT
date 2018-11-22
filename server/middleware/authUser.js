import 'babel-polyfill';
import jwt from 'jsonwebtoken';
import db from '../utility/dbconnect';

export default async (req, res, next) => {
  const token = req.headers['x-auth'];
  if (!token) {
    return res.status(401).json({ status: 401, error: 'No Token' });
  }
  (async () => {
    const {
      id, first_name: firstName, last_name: lastName, username, email,
    } = await jwt.verify(token, process.env.SECRET);
    const text = 'SELECT * FROM users WHERE id = $1';
    const { rows: [{ is_admin: isAdmin }] } = await db(text, [id]);
    req.admin = isAdmin;
    req.user = {
      id, firstName, lastName, username, email,
    };
    return next();
  })().catch(error => res.status(400).json({ status: 400, error, }));
  return undefined;
};
