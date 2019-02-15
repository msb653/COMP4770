/*
use myGame 
db.createCollection("account");
db.createCollection("progress");
*/

var mongojs = require('mongojs');
var db = mongojs('localhost:27017/myGame', ['account', 'progress']);

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

var isValidPassword = function(data, cb) {
  db.account.find(
    { username: data.username, password: data.password },
    function(err, res) {
      if (res.length > 0) {
        cb(true);
      } else cb(false);
    }
  );
};

var isUsernameTaken = function(data, cb) {
  db.account.find({ username: data.username }, function(err, res) {
    if (res.length > 0) {
      cb(true);
    } else cb(false);
  });
};

var addUser = function(data, cb) {
  db.account.insert(
    { username: data.username, password: data.password },
    function(err) {
      cb();
    }
  );
};

var io = require('socket.io')(serv, {});
io.sockets.on('connection', function(socket) {
  socket.on('signIn', function(data) {
    isValidPassword(data, function(res) {
      // Player.onConnect(socket);
      if (res) {
        socket.emit('signInResponse', { success: true });
      } else {
        socket.emit('signInResponse', { success: false });
      }
    });
  });

  socket.on('signUp', function(data) {
    isUsernameTaken(data, function(res) {
      if (res) {
        socket.emit('signUpResponse', { success: false });
      } else {
        addUser(data, function() {
          socket.emit('signUpResponse', { success: true });
        });
      }
    });
  });

  socket.emit('serverMsg', {
    msg: 'hello'
  });

  socket.on('disconnect', function() {
    console.log('user disconnected');
  });
});
