import request from 'request';

const isAddress = (address, callback) => {
  const codeAddress = encodeURIComponent(address);

  request({
    url: `https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyA2UEF_jKSFV1x1xLcA3Z8HNoBEBzGErM8&address=${codeAddress}`,
    json: true,
  },
  (error, response, body) => {
    if (error) {
      callback(undefined, '1');
    } else if (body.status !== 'OK') {
      callback(undefined, '2');
    } else {
      const { location } = body.results[0].geometry;
      callback(
        body.results[0].formatted_address,
        undefined,
        { lat: location.lat, lng: location.lng },
      );
    }
  });
};

const isValid = (string) => {
  const str = string.trim();
  if (!/^[a-zA-Z0-9,. ]*$/.test(str)) {
    return { valid: false, reason: 'illegal' };
  }

  if (str.length < 10) {
    return { valid: false, reason: 'short' };
  }

  return { valid: true, str };
};

const errorSelector = (reason, property) => {
  const msg = reason === 'illegal'
    ? `please use letters and numbers for your ${property}`
    : `please enter a more detailed ${property}`;
  return msg;
};

export { isValid, isAddress, errorSelector };
