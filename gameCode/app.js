var express = require('express');
var app = express();
var serv = require('http').Server(app);

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/client/index.html');
});
app.get('/gameCode/client/gameMenu.html', function(req, res) {
  res.sendFile(__dirname + '/client/gameMenu.html');
});
app.get('/gameCode/client/campaignMode.html', function(req, res) {
  res.sendFile(__dirname + '/client/campaignMode.html');
});
app.get('/gameCode/client/gameMenuStyle.css', function(req, res) {
  res.sendFile(__dirname + '/client/gameMenuStyle.css');
});
app.get('/gameCode/client/campaign.css', function(req, res) {
  res.sendFile(__dirname + '/client/campaign.css');
});

//Images
app.get('/gameCode/client/images/menuBackground.jpg', function(req, res) {
  res.sendFile(__dirname + '/client/images/menuBackground.jpg');
});
app.get('/gameCode/client/images/avatar.png', function(req, res) {
  res.sendFile(__dirname + '/client/images/avatar.png');
});
app.use('/client', express.static(__dirname + '/client'));

serv.listen(2000);
console.log('Server started.');

var USERS = {
  //username:password
  bob: 'aaa',
  bob2: 'bbb',
  bob3: 'ccc'
};

var isValidPassword = function(data) {
  return USERS[data.username] === data.password;
};
var isUsernameTaken = function(data) {
  return USERS[data.username];
};
var addUser = function(data) {
  USERS[data.username] = data.password;
};

var io = require('socket.io')(serv, {});
io.sockets.on('connection', function(socket) {
  socket.on('signIn', function(data) {
    if (isValidPassword(data)) {
      // Player.onConnect(socket);
      socket.emit('signInResponse', { success: true });
    } else {
      socket.emit('signInResponse', { success: false });
    }
  });

  socket.on('signUp', function(data) {
    if (isUsernameTaken(data)) {
      socket.emit('signUpResponse', { success: false });
    } else {
      addUser(data);
      socket.emit('signUpResponse', { success: true });
    }
  });

  socket.emit('serverMsg', {
    msg: 'hello'
  });

  socket.on('disconnect', function() {
    console.log('user disconnected');
  });
});
