// io is available to call when the above source is loaded
// io() initiating a request to the server to open up connection
var socket = io();

// Avoid using arrow function on client side,
// Only V8 from chrome work correctly with arrow function
// If other browsers or mobile browsers, things might not work
socket.on("connect", function() {
  console.log("Connected to server.");
});

socket.on("disconnect", function() {
  console.log("Disconnected from server.");
});

socket.on("newMessage", function(message) {
  console.log("New message", message);
  var li = $("<li></li>");
  li.text(`${message.from}: ${message.text}`);

  $("#messages").append(li);
});

socket.emit(
  "createMessage",
  {
    from: "chan",
    text: "Hola"
  },
  function(data) {
    console.log("Got it", data);
  }
);

$("#message-form").on("submit", function(event) {
  event.preventDefault();

  socket.emit(
    "createMessage",
    {
      from: "User",
      text: $("[name=message]").val()
    },
    function() {}
  );
});
