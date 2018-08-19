// Require modules
// -----Set up express
const express = require("express");
const app = express();
// -----Other modules
const socketIO = require("socket.io");
const http = require("http");
// -----Require local modules
const { generateMessage, generateLocationMessage } = require("./utils/message");
const { isRealString } = require("./utils/validation");
const { Users } = require("./utils/users");

// Pre setup
// -----Set public path variable
const path = require("path");
const publicPath = path.join(__dirname, "../public");

// -----Set up http server with socket.io
const server = http.createServer(app);
const io = socketIO(server);

var users = new Users();

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

  socket.on("join", (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback("Name and room name are required");
    }

    socket.join(params.room);
    users.removeUser(socket.id); // Remove user from any potential room
    users.addUser(socket.id, params.name, params.room);

    // io.emit -> io.to("room").emit
    // socket.broadcast.emit -> socket.broadcast.to("room").emit
    // socket.emit (there's no reason to target by room when we only send the message to a specific user)

    io.to(params.room).emit("updateUserList", users.getUserList(params.room));
    // socket.emit from Admin text Welcome to the chat app
    socket.emit(
      "newMessage",
      generateMessage("Admin", "Welcome to the chat app")
    );

    // socket.broadcast.emit from Admin text New user joined
    // socket.broadcast.emit(
    //   "newMessage",
    //   generateMessage("Admin", "New user joined")
    // );

    socket.broadcast
      .to(params.room)
      .emit("newMessage", generateMessage("Admin", `${params.name} joined`));

    callback();
  });

  socket.on("createMessage", (newMessage, callback) => {
    var user = users.getUser(socket.id);

    if (user && isRealString(newMessage.text)) {
      // io.emit() send message to all connection
      io.to(user.room).emit(
        "newMessage",
        generateMessage(user.name, newMessage.text)
      );
    }

    callback(); // Callback acts as an acknowledgement

    // socket.broadcast.emit() send to everybody but you
    // socket.broadcast.emit("newMessage", {
    //   from: newMessage.from,
    //   text: newMessage.text,
    //   createAt: new Date().getTime()
    // });
  });

  socket.on("createLocationMessage", coords => {
    var user = users.getUser(socket.id);

    if (user) {
      io.to(user.room).emit(
        "newLocationMessage",
        generateLocationMessage(user.name, coords.latitude, coords.longitude)
      );
    }
  });

  socket.on("disconnect", () => {
    console.log("User was disconnected.");
    var user = users.removeUser(socket.id);

    if (user) {
      io.to(user.room).emit("updateUserList", users.getUserList(user.room));
      io.to(user.room).emit(
        "newMessage",
        generateMessage("Admin", `${user.name} has left`)
      );
    }
  });
});

server.listen(port, () => {
  console.log(`Server started at port ${port}`);
});
