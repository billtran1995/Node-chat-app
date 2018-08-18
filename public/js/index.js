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

socket.on("newLocationMessage", function(message) {
  var li = $("<li></li>");
  var a = $('<a target="_blank">My current location</a>');

  li.text(`${message.from}: `);
  a.attr("href", message.url);
  li.append(a);
  $("#messages").append(li);
});

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

var locationButton = $("#send-location");
locationButton.on("click", function() {
  if (!navigator.geolocation) {
    return alert("Geolocation not supported by your browser.");
  }

  navigator.geolocation.getCurrentPosition(
    function(position) {
      console.log(position);
      socket.emit("createLocationMessage", {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
    },
    function() {
      alert("Unable to fetch location.");
    }
  );
});
