// Require modules
// -----Set up express
const express = require("express");
const app = express();
// -----Other modules
const socketIO = require("socket.io");
const http = require("http");
// -----Require local modules
const { generateMessage, generateLocationMessage } = require("./utils/message");

// Pre setup
// -----Set public path variable
const path = require("path");
const publicPath = path.join(__dirname, "../public");

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

  // socket.emit() send message to a connection
  //   socket.emit("newMessage", {
  //     from: "tran",
  //     text: "hi",
  //     created: Date.now()
  //   });

  // socket.emit from Admin text Welcome to the chat app
  socket.emit(
    "newMessage",
    generateMessage("Admin", "Welcome to the chat app")
  );

  // socket.broadcast.emit from Admin text New user joined
  socket.broadcast.emit(
    "newMessage",
    generateMessage("Admin", "New user joined")
  );

  socket.on("createMessage", (newMessage, callback) => {
    console.log("createMessage", newMessage);

    // io.emit() send message to all connection
    io.emit("newMessage", generateMessage(newMessage.from, newMessage.text));
    callback("This is from the server"); // Callback acts as an acknowledgement

    // socket.broadcast.emit() send to everybody but you
    // socket.broadcast.emit("newMessage", {
    //   from: newMessage.from,
    //   text: newMessage.text,
    //   createAt: new Date().getTime()
    // });
  });

  socket.on("createLocationMessage", coords => {
    io.emit(
      "newLocationMessage",
      generateLocationMessage("Admin", coords.latitude, coords.longitude)
    );
  });

  socket.on("disconnect", () => {
    console.log("User was disconnected.");
  });
});

server.listen(port, () => {
  console.log(`Server started at port ${port}`);
});
