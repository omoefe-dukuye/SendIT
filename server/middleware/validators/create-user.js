import { isEmail } from 'validator';

export default (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send('Please fill all fields.');
  }
  if (!isEmail(req.body.email)) {
    return res.status(400).send('Invalid email.');
  }
  return next();
};
