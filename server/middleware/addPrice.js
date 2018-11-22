export default (req, res, next) => {
  const { distance, weight } = req.body;
  req.body.price = `N ${Math.round(distance * weight * 5 + 500)}`;
  next();
};
