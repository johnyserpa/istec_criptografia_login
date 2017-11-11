module.exports = function(io) {
  var app = require('express');
  var router = app.Router();

  io.on('connection', (socket) => {
    console.log("User connected...");
    socket.emit('message', 'banana2');
    console.log("Afeter emit")
    socket.on('message', function(msg) { 
      console.log(msg);
    });

  })

  return router;
}