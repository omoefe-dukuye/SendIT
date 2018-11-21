import { isEmail } from 'validator';

export default (req, res, next) => {
  if (!req.body.email || !req.body.password || !req.body.firstName
    || !req.body.lastName || !req.body.username) {
    return res.status(400).send('Please fill all fields.');
  }
  if (!isEmail(req.body.email)) {
    return res.status(400).json({
      status: 400,
      message: 'invalid email',
    });
  }
  if (req.body.password.length < 6) {
    return res.status(400).json({
      status: 400,
      message: 'Password should be longer than 5 characters.',
    });
  }
  return next();
};
