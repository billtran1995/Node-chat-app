// Require modules
// -----Set up express
const express = require("express");
const app = express();
// ----Other modules
const socketIO = require("socket.io");
const http = require("http");

// Pre setup
// -----Set public path variable
const path = require("path");
const publicPath = path.join(__dirname, "..\\public");

// -----Set up http server with socket.io
const server = http.createServer(app);
const io = socketIO(server);

// -----Set up port
const port = process.env.PORT || 5000;

// Use middleware
app.use(express.static(publicPath));

// Register for an event listener
io.on("connection", socket => {
  console.log("New client connected.");

  socket.emit("newMessage", {
    from: "tran",
    text: "hi",
    created: Date.now()
  });

  socket.on("createMessage", newMessage => {
    console.log("createMessage", newMessage);
  });

  socket.on("disconnect", () => {
    console.log("User was disconnected.");
  });
});

server.listen(port, () => {
  console.log(`Server started at port ${port}`);
});
