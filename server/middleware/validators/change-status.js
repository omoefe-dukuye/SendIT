
export default (req, res, next) => {
  const { status } = req.body;
  return status !== 'created' && status !== 'in-transit' && status !== 'cancelled' && status !== 'delivered'
    ? res.status(400).json({ status: 400, error: 'invalid status' })
    : next();
};
