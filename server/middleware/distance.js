import computeDistance from '../helpers/distanceHelp';

const addDistance = (req, res, next) => {
  req.body.distance = `${Math.round(
    computeDistance(req.body.locationCoords, req.body.destinationCoords),
  )} km`;
  next();
};

export default addDistance;
