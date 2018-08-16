// Set up express
const express = require("express");
const app = express();

// Set public path variable
const path = require("path");
const publicPath = path.join(__dirname, "..\\public");

// Set up port
const port = process.env.PORT || 5000;

// Use middleware
app.use(express.static(publicPath));

app.listen(port, () => {
  console.log(`Server started at port ${port}`);
});
