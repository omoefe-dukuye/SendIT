import request from 'request';


/**
   * Gets standard address an coordinates for address passed in.
   * @param {String} address the address to be found.
   * @param {Function} callback the callback function that is supplied the details.
   */
const isAddress = (address, callback) => {
  const codeAddress = encodeURIComponent(address);

  request({
    url: `https://maps.googleapis.com/maps/api/geocode/json?key=${process.env.GOOGLE_KEY}&address=${codeAddress}`,
    json: true,
  },
  (error, response, body) => {
    if (body.status !== 'OK') {
      callback(undefined, 'Invalid location');
    } else {
      const { location } = body.results[0].geometry;

      const { formatted_address: formattedAddress } = body.results[0];

      callback(
        formattedAddress,
        undefined,
        { lat: location.lat, lng: location.lng },
      );
    }
  });
};

/**
   * Checks input for validity.
   * @param {String} string the request object.
   * @return {Object} object with test results
   */
const isValid = (string) => {
  const str = string.trim();
  if (!/^[a-zA-Z0-9,. ]*$/.test(str)) {
    return { valid: false, reason: 'illegal' };
  }

  if (str.length < 10 || str.length > 30) {
    return { valid: false, reason: 'short' };
  }

  return { valid: true, str };
};

const errorSelector = (reason, property) => {
  const msg = reason === 'illegal'
    ? `please use letters and numbers for your ${property}`
    : `please enter a ${property} between 10 and 30 characters`;
  return msg;
};

export { isValid, isAddress, errorSelector };
