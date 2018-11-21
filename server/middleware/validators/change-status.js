/* eslint-disable no-confusing-arrow */
export default (req, res, next) => req.body.status !== 'created' && req.body.status !== 'in-transit' && req.body.status !== 'cancelled' && req.body.status !== 'delivered'
  ? res.status(400).json({ status: 400, error: 'invalid status' })
  : next();
