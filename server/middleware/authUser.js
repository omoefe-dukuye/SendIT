import 'babel-polyfill';
import jwt from 'jsonwebtoken';
import db from '../utility/dbconnect';

export default async (req, res, next) => {
  const token = req.headers['x-auth'];
  if (!token) {
    return res.status(401).json({ status: 401, error: 'No Token' });
  }
  (async () => {
    const decoded = await jwt.verify(token, process.env.SECRET);
    const text = 'SELECT * FROM users WHERE id = $1';
    const { rows } = await db(text, [decoded.userId]);
    req.admin = rows[0].is_admin;
    req.user = { id: decoded.userId };
    return next();
  })().catch(error => res.status(400).send(error));
  return undefined;
};
