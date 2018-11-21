const degreesToRadians = degrees => (degrees * Math.PI) / 180;

const computeDistance = (startCoords, destCoords) => {
  const startLatRads = degreesToRadians(startCoords.lat);
  const startLongRads = degreesToRadians(startCoords.lng);
  const destLatRads = degreesToRadians(destCoords.lat);
  const destLongRads = degreesToRadians(destCoords.lng);

  const Radius = 6371; // radius of the Earth in km
  const distance = Math.acos(Math.sin(startLatRads)
    * Math.sin(destLatRads)
    + Math.cos(startLatRads) * Math.cos(destLatRads)
    * Math.cos(startLongRads - destLongRads)) * Radius;

  return distance;
};

export default computeDistance;
