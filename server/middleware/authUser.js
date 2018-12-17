import 'babel-polyfill';
import jwt from 'jsonwebtoken';

export default async (req, res, next) => {
  const token = req.headers['x-auth'];
  if (!token) {
    return res.status(401).json({ status: 401, error: 'No Token' });
  }
  try {
    const { id, isAdmin: admin } = await jwt.verify(token, process.env.SECRET);
    req.user = { id, admin };
    return next();
  } catch (error) {
    return res.status(400).json({ status: 400, error });
  }
};
