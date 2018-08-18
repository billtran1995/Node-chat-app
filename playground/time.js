var moment = require("moment");

var date = moment(); // this create a object that represent the current moment in time
console.log(date.format("h:mm a"));

// moment().valueOf() is same as Date.time()
