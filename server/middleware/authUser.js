import 'babel-polyfill';
import jwt from 'jsonwebtoken';
import db from '../utility/dbconnect';

export default async (req, res, next) => {
  const token = req.headers['x-auth'];
  if (!token) {
    return res.status(400).send({ error: 'No Token' });
  }
  try {
    const decoded = await jwt.verify(token, process.env.SECRET);
    const text = 'SELECT * FROM users WHERE id = $1';
    const { rows } = await db(text, [decoded.userId]);
    if (!rows[0]) {
      return res.status(400).send({ error: 'Invalid token' });
    }
    req.admin = rows[0].role === 'admin';
    req.user = { id: decoded.userId };
    next();
  } catch (error) {
    return res.status(400).send(error);
  }
  return undefined;
};
