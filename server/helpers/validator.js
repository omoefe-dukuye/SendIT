import request from 'request';


/**
   * Gets standard address an coordinates for address passed in.
   * @param {String} address the address to be found.
   * @return {Object} callback the callback function that is supplied the details.
   */
const isAddress = (address) => {
  const codeAddress = encodeURIComponent(address);

  return new Promise((resolve, reject) => {
    request({
      url: `https://maps.googleapis.com/maps/api/geocode/json?key=${process.env.GOOGLE_KEY}&address=${codeAddress}`,
      json: true,
    },
    (error, response, body) => {
      if (error) {
        const err = new Error(1);
        reject(err);
      } else if (body.status !== 'OK') {
        const err = new Error(2);
        reject(err);
      } else {
        const coords = body.results[0].geometry.location;
        const { formatted_address: formattedAddress } = body.results[0];

        resolve({ formattedAddress, coords });
      }
    });
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
