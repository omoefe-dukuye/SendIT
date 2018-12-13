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
    if (error) {
      callback(undefined, 1);
    } else if (body.status !== 'OK') {
      callback(undefined, 2);
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
  if (!/^[a-zA-Z0-9]+[a-zA-Z0-9,. ]*$/.test(str)) {
    return { valid: false, reason: 'illegal' };
  }

  if (str.length < 10 || str.length > 60) {
    return { valid: false, reason: 'short' };
  }

  return { valid: true, str };
};

const errorSelector = (reason, property) => {
  const msg = reason === 'illegal'
    ? `Please use letters and numbers for your ${property}.`
    : `Please enter a more descriptive ${property} (between 10 and 30 characters).`;
  return msg;
};

export { isValid, isAddress, errorSelector };
