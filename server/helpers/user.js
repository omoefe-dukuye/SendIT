import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export default {
  hashPassword: password => bcrypt.hashSync(password, bcrypt.genSaltSync(8)),

  comparePassword: (hashPassword, password) => bcrypt.compareSync(password, hashPassword),

  generateToken: id => jwt.sign(
    { userId: id },
    process.env.SECRET,
    { expiresIn: '7d' },
  ),
};
