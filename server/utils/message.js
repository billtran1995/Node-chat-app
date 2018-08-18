var generateMessage = (from, text) => {
  return {
    from,
    text,
    created: new Date().getTime()
  };
};

var generateLocationMessage = (from, latitude, longitude) => {
  return {
    from,
    url: `https://www.google.com/maps?=${latitude},${longitude}`,
    created: new Date().getTime()
  };
};

module.exports = { generateMessage, generateLocationMessage };
