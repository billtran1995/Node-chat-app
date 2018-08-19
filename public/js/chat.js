// io is available to call when the above source is loaded
// io() initiating a request to the server to open up connection
var socket = io();

function scrollToBottom() {
  var messages = $("#messages");
  var newMessage = messages.children("li:last-child"); // beware of space(no spaces are allowed)

  var clientHeight = messages.prop("clientHeight");
  var scollTop = messages.prop("scrollTop");
  var scrollHeight = messages.prop("scrollHeight");
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  if (
    clientHeight + scollTop + newMessageHeight + lastMessageHeight >=
    scrollHeight
  ) {
    messages.scrollTop(scrollHeight);
  }
}

// Avoid using arrow function on client side,
// Only V8 from chrome work correctly with arrow function
// If other browsers or mobile browsers, things might not work
socket.on("connect", function() {
  console.log("Connected to server.");
  var params = $.deparam(window.location.search);

  socket.emit("join", params, function(err) {
    if (err) {
      alert(err);
      window.location.href = "/";
    } else {
      console.log("No error");
    }
  });
});

socket.on("disconnect", function() {
  console.log("Disconnected from server.");
});

socket.on("updateUserList", function(users) {
  console.log("Users list", users);
  var ol = $("<ol></ol>");

  users.forEach(function(user) {
    ol.append($("<li></li>").text(user));
  });
});

socket.on("newMessage", function(message) {
  var formattedTime = moment(message.created).format("h:mm a");
  var template = $("#message-template").html();
  var html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    created: formattedTime
  });

  $("#messages").append(html);
  scrollToBottom();
  // var formattedTime = moment(message.created).format("h:mm a");
  // console.log("New message", message);
  // var li = $("<li></li>");
  // li.text(`${message.from} ${formattedTime}: ${message.text}`);

  // $("#messages").append(li);
});

// socket.emit(
//   "createMessage",
//   {
//     from: "chan",
//     text: "Hola"
//   },
//   function(data) {
//     console.log("Got it", data);
//   }
// );

socket.on("newLocationMessage", function(message) {
  var formattedTime = moment(message.created).format("h:mm a");
  var template = $("#location-message-template").html();
  var html = Mustache.render(template, {
    from: message.from,
    url: message.url,
    created: formattedTime
  });

  $("#messages").append(html);
  scrollToBottom();

  // var li = $("<li></li>");
  // var a = $('<a target="_blank">My current location</a>');

  // li.text(`${message.from} ${formattedTime}: `);
  // a.attr("href", message.url);
  // li.append(a);
  // $("#messages").append(li);
});

$("#message-form").on("submit", function(event) {
  event.preventDefault();

  var messageTextbox = $("[name=message]");

  socket.emit(
    "createMessage",
    {
      from: "User",
      text: $("[name=message]").val()
    },
    function() {
      messageTextbox.val("");
    }
  );
});

var locationButton = $("#send-location");
locationButton.on("click", function() {
  if (!navigator.geolocation) {
    return alert("Geolocation not supported by your browser.");
  }

  locationButton.attr("disabled", "disabled").text("Sending location...");

  navigator.geolocation.getCurrentPosition(
    function(position) {
      locationButton.removeAttr("disabled").text("Send location");
      console.log(position);
      socket.emit("createLocationMessage", {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
    },
    function() {
      locationButton.removeAttr("disabled").text("Send location");
      alert("Unable to fetch location.");
    }
  );
});
