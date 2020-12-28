const express = require('express');
const app = express();
const server = require('http').createServer(app);
const socketio = require('socket.io');
const io = socketio(server);


users = [];
connections = [];

server.listen(process.env.PORT || 3003, () => console.log('Server running...'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {

  //Register New connection
  connections.push(socket);
  console.log(`Connected to ${connections.length} sockets`);


  //Disconnect
  socket.on('disconnect', () => {
    users.splice(users.indexOf(socket.username), 1);
    updateUserNames();
    connections.splice(connections.indexOf(socket), 1);
    console.log('Disconnected')
  })

  //Send Message
  socket.on('sendMessage', (data) => {
    console.log(data)
    io.emit('newMessage', {msg: data, user: socket.username});
  });
  
  //New User
  socket.on('newUser', (data, callback) => {
    callback(true);
    socket.username = data;
    users.push(socket.username);
    updateUserNames();
  });

  function updateUserNames() {
    io.emit('getUsers', users)
  }

});