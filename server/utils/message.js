const moment = require("moment");

var generateMessage = (from, text) => {
  return {
    from,
    text,
    created: moment().valueOf()
  };
};

var generateLocationMessage = (from, latitude, longitude) => {
  return {
    from,
    url: `https://www.google.com/maps?=${latitude},${longitude}`,
    created: moment().valueOf()
  };
};

module.exports = { generateMessage, generateLocationMessage };
