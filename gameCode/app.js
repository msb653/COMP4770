/*
use myGame 
db.createCollection("account");
db.createCollection("progress");
db.createCollection("level");
*/

var mongojs = require('mongojs');
var db = mongojs('localhost:27017/myGame', ['account', 'progress']);

var express = require('express');
var app = express();

var nodemailer = require('nodemailer');
var pbkdf2 = require('pbkdf2');

var serv = require('http').Server(app);

//HTML
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/client/index.html');
});
app.get('/gameCode/client/gameMenu.html', function(req, res) {
  res.sendFile(__dirname + '/client/gameMenu.html');
});
app.get('/gameCode/client/levelEditor.html', function(req, res) {
  res.sendFile(__dirname + '/client/levelEditor.html');
});
app.get('/gameCode/client/loadLevel.html', function(req, res) {
  res.sendFile(__dirname + '/client/loadLevel.html');
});
app.get('/gameCode/client/campaignMode.html', function(req, res) {
  res.sendFile(__dirname + '/client/campaignMode.html');
});
app.get('/gameCode/client/overworld.html', function(req, res) {
  res.sendFile(__dirname + '/client/overworld.html');
});
app.get('/gameCode/client/achievements.html', function(req, res) {
  res.sendFile(__dirname + '/client/achievements.html');
});

//CSS
app.get('/gameCode/client/gameMenuStyle.css', function(req, res) {
  res.sendFile(__dirname + '/client/gameMenuStyle.css');
});
app.get('/gameCode/client/campaign.css', function(req, res) {
  res.sendFile(__dirname + '/client/campaign.css');
});
app.get('/gameCode/client/levelEditor.css', function(req, res) {
  res.sendFile(__dirname + '/client/LevelEditor.css');
});
app.get('/gameCode/client/css/reset.css', function(req, res) {
  res.sendFile(__dirname + '/client/css/reset.css');
});
app.get('/gameCode/client/css/style.css', function(req, res) {
  res.sendFile(__dirname + '/client/css/style.css');
});

//Images
app.get('/gameCode/client/images/menuBackground.jpg', function(req, res) {
  res.sendFile(__dirname + '/client/images/menuBackground.jpg');
});
app.get('/gameCode/client/images/homePicture.jpg', function(req, res) {
  res.sendFile(__dirname + '/client/images/homePicture.jpg');
});
app.get('/gameCode/client/images/homePicture2.jpg', function(req, res) {
  res.sendFile(__dirname + '/client/images/homePicture2.jpg');
});
app.get('/gameCode/client/images/avatar.png', function(req, res) {
  res.sendFile(__dirname + '/client/images/avatar.png');
});
app.get('/gameCode/client/images/shoot.png', function(req, res) {
  res.sendFile(__dirname + '/client/images/shoot.png');
});
app.get('/gameCode/client/images/castleTiles.png', function(req, res) {
  res.sendFile(__dirname + '/client/images/castleTiles.png');
});
app.get('/gameCode/client/images/dark_forest.png', function(req, res) {
  res.sendFile(__dirname + '/client/images/dark_forest.png');
});
app.get('/gameCode/client/images/underwater.png', function(req, res) {
  res.sendFile(__dirname + '/client/images/underwater.png');
});
app.get('/gameCode/client/images/cave.png', function(req, res) {
  res.sendFile(__dirname + '/client/images/cave.png');
});
app.get('/gameCode/client/images/cave_tileset.png', function(req, res) {
  res.sendFile(__dirname + '/client/images/cave_tileset.png');
});
app.get('/gameCode/client/images/tilemap.png', function(req, res) {
  res.sendFile(__dirname + '/client/images/tilemap.png');
});
app.get('/gameCode/client/images/cave.png', function(req, res) {
  res.sendFile(__dirname + '/client/images/cave.png');
});
app.get('/gameCode/client/images/castle.png', function(req, res) {
  res.sendFile(__dirname + '/client/images/castle.png');
});
app.get('/gameCode/client/images/gem.gif', function(req, res) {
  res.sendFile(__dirname + '/client/images/gem.gif');
});
app.get('/gameCode/client/images/forest.png', function(req, res) {
  res.sendFile(__dirname + '/client/images/forest.png');
});
app.get('/gameCode/client/images/lava.png', function(req, res) {
  res.sendFile(__dirname + '/client/images/lava.png');
});
app.get('/gameCode/client/images/openChest.png', function(req, res) {
  res.sendFile(__dirname + '/client/images/openChest.png');
});
app.get('/gameCode/client/images/svg/si-glyph-arrow-thick-left.svg', function(req, res) {
  res.sendFile(__dirname + '/client/images/svg/si-glyph-arrow-thick-left.svg');
});
app.get('/gameCode/client/images/svg/si-glyph-arrow-thick-right.svg', function(req, res) {
  res.sendFile(__dirname + '/client/images/svg/si-glyph-arrow-thick-right.svg');
});
app.get('/gameCode/client/images/svg/si-glyph-arrow-thick-up.svg', function(req, res) {
  res.sendFile(__dirname + '/client/images/svg/si-glyph-arrow-thick-up.svg');
});
app.get('/gameCode/client/images/svg/si-glyph-arrow-thick-down.svg', function(req, res) {
  res.sendFile(__dirname + '/client/images/svg/si-glyph-arrow-thick-down.svg');
});
app.get('/gameCode/client/images/svg/si-glyph-triangle-down.svg', function(req, res) {
  res.sendFile(__dirname + '/client/images/svg/si-glyph-triangle-down.svg');
});
app.get('/gameCode/client/images/svg/si-glyph-triangle-right.svg', function(req, res) {
  res.sendFile(__dirname + '/client/images/svg/si-glyph-triangle-right.svg');
});
app.get('/gameCode/client/images/svg/si-glyph-sound.svg', function(req, res) {
  res.sendFile(__dirname + '/client/images/svg/si-glyph-sound.svg');
});
app.get('/gameCode/client/images/svg/si-glyph-sound-mute.svg', function(req, res) {
  res.sendFile(__dirname + '/client/images/svg/si-glyph-sound-mute.svg');
});
app.get('/gameCode/client/images/svg/controlKey.jpg', function(req, res) {
  res.sendFile(__dirname + '/client/images/svg/controlKey.jpg');
});
app.get('/gameCode/client/images/optionsSign.png', function(req, res) {
  res.sendFile(__dirname + '/client/images/optionsSign.png');
});
app.get('/gameCode/client/images/smoke.mp4', function(req, res) {
  res.sendFile(__dirname + '/client/images/smoke.mp4');
});
app.get('/gameCode/client/images/door.png', function(req, res) {
  res.sendFile(__dirname + '/client/images/door.png');
});
app.get('/gameCode/client/images/teleporter.png', function(req, res) {
  res.sendFile(__dirname + '/client/images/teleporter.png');
});
app.get('/gameCode/client/images/teleporter3.png', function(req, res) {
  res.sendFile(__dirname + '/client/images/teleporter3.png');
});
app.get('/gameCode/client/images/bomb.png', function(req, res) {
  res.sendFile(__dirname + '/client/images/bomb.png');
});
app.get('/gameCode/client/images/bat2.png', function(req, res) {
  res.sendFile(__dirname + '/client/images/bat2.png');
});
app.get('/gameCode/client/images/back-btn.png', function(req, res) {
  res.sendFile(__dirname + '/client/images/back-btn.png');
});
app.get('/gameCode/client/images/bg.png', function(req, res) {
  res.sendFile(__dirname + '/client/images/bg.png');
});
app.get('/gameCode/client/images/arrow.png', function(req, res) {
  res.sendFile(__dirname + '/client/images/arrow.png');
});
app.get('/gameCode/client/images/clear-map-btn.png', function(req, res) {
  res.sendFile(__dirname + '/client/images/clear-map-btn.png');
});
app.get('/gameCode/client/images/coin.png', function(req, res) {
  res.sendFile(__dirname + '/client/images/coin.png');
});
app.get('/gameCode/client/images/delete-all-btn.png', function(req, res) {
  res.sendFile(__dirname + '/client/images/delete-all-btn.png');
});
app.get('/gameCode/client/images/editor-btn.png', function(req, res) {
  res.sendFile(__dirname + '/client/images/editor-btn.png');
});
app.get('/gameCode/client/images/elements.png', function(req, res) {
  res.sendFile(__dirname + '/client/images/elements.png');
});
app.get('/gameCode/client/images/enemy.png', function(req, res) {
  res.sendFile(__dirname + '/client/images/enemy.png');
});
app.get('/gameCode/client/images/start-screen.png', function(req, res) {
  res.sendFile(__dirname + '/client/images/start-screen.png');
});
app.get('/gameCode/client/images/grid-large-btn.png', function(req, res) {
  res.sendFile(__dirname + '/client/images/grid-large-btn.png');
});
app.get('/gameCode/client/images/grid-medium-btn.png', function(req, res) {
  res.sendFile(__dirname + '/client/images/grid-medium-btn.png');
});
app.get('/gameCode/client/images/grid-small-btn.png', function(req, res) {
  res.sendFile(__dirname + '/client/images/grid-small-btn.png');
});
app.get('/gameCode/client/images/grid.png', function(req, res) {
  res.sendFile(__dirname + '/client/images/grid.png');
});
app.get('/gameCode/client/images/king-head.png', function(req, res) {
  res.sendFile(__dirname + '/client/images/king-head.png');
});
app.get('/gameCode/client/images/knight.png', function(req, res) {
  res.sendFile(__dirname + '/client/images/knight.png');
});
app.get('/gameCode/client/images/powerups.png', function(req, res) {
  res.sendFile(__dirname + '/client/images/powerups.png');
});
app.get('/gameCode/client/images/save-map-btn.png', function(req, res) {
  res.sendFile(__dirname + '/client/images/save-map-btn.png');
});
app.get('/gameCode/client/images/saved-btn.png', function(req, res) {
  res.sendFile(__dirname + '/client/images/saved-btn.png');
});
app.get('/gameCode/client/images/slider-left.png', function(req, res) {
  res.sendFile(__dirname + '/client/images/slider-left.png');
});
app.get('/gameCode/client/images/slider-right.png', function(req, res) {
  res.sendFile(__dirname + '/client/images/slider-right.png');
});
app.get('/gameCode/client/images/start-btn.png', function(req, res) {
  res.sendFile(__dirname + '/client/images/start-btn.png');
});
app.get('/gameCode/client/images/enemies.png', function(req, res) {
  res.sendFile(__dirname + '/client/images/enemies.png');
});
app.get('/gameCode/client/images/bullet.png', function(req, res) {
  res.sendFile(__dirname + '/client/images/bullet.png');
});
app.get('/gameCode/client/images/icon.gif', function(req, res) {
  res.sendFile(__dirname + '/client/images/icon.gif');
});
app.get('/gameCode/client/images/openChest.png', function(req, res) {
  res.sendFile(__dirname + '/client/images/openChest.png');
});

app.get('/gameCode/client/images/overworld.png', function(req, res) {
  res.sendFile(__dirname + '/client/images/overworld.png');
});
app.get('/gameCode/client/images/knightRight.gif', function(req, res) {
  res.sendFile(__dirname + '/client/images/knightRight.gif');
});

// Testing
app.get('/gameCode/client/js/View.js', function(req, res) {
  res.sendFile(__dirname + '/client/js/View.js');
});
app.get('/gameCode/client/js/GameUI.js', function(req, res) {
  res.sendFile(__dirname + '/client/js/GameUI.js');
});
app.get('/gameCode/client/js/mainGame/GameSound.js', function(req, res) {
  res.sendFile(__dirname + '/client/js/mainGame/GameSound.js');
});
app.get('/gameCode/client/js/mainGame/Element.js', function(req, res) {
  res.sendFile(__dirname + '/client/js/mainGame/Element.js');
});
app.get('/gameCode/client/js/mainGame/PowerUp.js', function(req, res) {
  res.sendFile(__dirname + '/client/js/mainGame/PowerUp.js');
});
app.get('/gameCode/client/js/mainGame/Enemy.js', function(req, res) {
  res.sendFile(__dirname + '/client/js/mainGame/Enemy.js');
});
app.get('/gameCode/client/js/mainGame/Bullet.js', function(req, res) {
  res.sendFile(__dirname + '/client/js/mainGame/Bullet.js');
});
app.get('/gameCode/client/js/mainGame/King.js', function(req, res) {
  res.sendFile(__dirname + '/client/js/mainGame/King.js');
});
app.get('/gameCode/client/js/mainGame/Score.js', function(req, res) {
  res.sendFile(__dirname + '/client/js/mainGame/Score.js');
});
app.get('/gameCode/client/js/mainGame/KingGame.js', function(req, res) {
  res.sendFile(__dirname + '/client/js/mainGame/KingGame.js');
});
app.get('/gameCode/client/js/levelEditor/Storage.js', function(req, res) {
  res.sendFile(__dirname + '/client/js/levelEditor/Storage.js');
});
app.get('/gameCode/client/js/levelEditor/Editor.js', function(req, res) {
  res.sendFile(__dirname + '/client/js/levelEditor/Editor.js');
});
app.get('/gameCode/client/js/levelEditor/CreatedLevels.js', function(req, res) {
  res.sendFile(__dirname + '/client/js/levelEditor/CreatedLevels.js');
});
app.get('/gameCode/client/js/KingMaker.js', function(req, res) {
  res.sendFile(__dirname + '/client/js/KingMaker.js');
});
app.get('/gameCode/client/js/Preloader.js', function(req, res) {
  res.sendFile(__dirname + '/client/js/Preloader.js');
});

app.get('/gameCode/client/images/bow_icon.png', function(req, res) {
	  res.sendFile(__dirname + '/client/images/bow_icon.png');
	});
app.get('/gameCode/client/images/staff_icon.png', function(req, res) {
	  res.sendFile(__dirname + '/client/images/staff_icon.png');
	});
app.get('/gameCode/client/images/sword_icon.png', function(req, res) {
	  res.sendFile(__dirname + '/client/images/sword_icon.png');
	});
app.get('/gameCode/client/images/teleport_icon.png', function(req, res) {
	  res.sendFile(__dirname + '/client/images/teleport_icon.png');
	});
app.get('/gameCode/client/images/no_weapon_icon.png', function(req, res) {
	  res.sendFile(__dirname + '/client/images/no_weapon_icon.png');
	});
app.get('/gameCode/client/images/arrowLeft.png', function(req, res) {
	  res.sendFile(__dirname + '/client/images/arrowLeft.png');
	});
app.get('/gameCode/client/images/swordLeft.png', function(req, res) {
	  res.sendFile(__dirname + '/client/images/swordLeft.png');
	});

//Sounds
app.get('/gameCode/client/sounds/jump.wav', function(req, res) {
  res.sendFile(__dirname + '/client/sounds/jump.wav');
});
app.get('/gameCode/client/sounds/bow.wav', function(req, res) {
  res.sendFile(__dirname + '/client/sounds/bow.wav');
});
app.get('/gameCode/client/sounds/king-death.wav', function(req, res) {
  res.sendFile(__dirname + '/client/sounds/king-death.wav');
});
app.get('/gameCode/client/sounds/gameOver.wav', function(req, res) {
  res.sendFile(__dirname + '/client/sounds/gameOver.wav');
});
app.get('/gameCode/client/sounds/fireball.wav', function(req, res) {
  res.sendFile(__dirname + '/client/sounds/fireball.wav');
});
app.get('/gameCode/client/sounds/MainMenuSound.wav', function(req, res) {
  res.sendFile(__dirname + '/client/sounds/MainMenuSound.wav');
});
app.get('/gameCode/client/sounds/loginPageSound.wav', function(req, res) {
  res.sendFile(__dirname + '/client/sounds/loginPageSound.wav');
});
app.get('/gameCode/client/sounds/bomb.wav', function(req, res) {
  res.sendFile(__dirname + '/client/sounds/bomb.wav');
});
app.get('/gameCode/client/sounds/teleport.mp3', function(req, res) {
	res.sendFile(__dirname + '/client/sounds/teleport.mp3');
});
app.get('/gameCode/client/sounds/throw.wav', function(req, res) {
	res.sendFile(__dirname + '/client/sounds/throw.wav');
});
app.get('/gameCode/client/sounds/sword.wav', function(req, res) {
	res.sendFile(__dirname + '/client/sounds/sword.wav');
});
app.get('/gameCode/client/sounds/silence.mp3', function(req, res) {
  res.sendFile(__dirname + '/client/sounds/silence.mp3');
});

app.use('/client', express.static(__dirname + '/client'));

serv.listen(2000);
console.log('Server started.');

var SOCKET_LIST = {};

var Entity = function() {
  var self = {
    x: 250,
    y: 250,
    spdX: 0,
    spdY: 0,
    id: ''
  };
  self.update = function() {
    self.updatePosition();
  };
  self.updatePosition = function() {
    self.x += self.spdX;
    self.y += self.spdY;
  };
  self.getDistance = function(pt) {
    return Math.sqrt(Math.pow(self.x - pt.x, 2) + Math.pow(self.y - pt.y, 2));
  };
  return self;
};

var Player = function(id) {
  var self = Entity();
  self.id = id;
  self.number = '' + Math.floor(10 * Math.random());
  self.pressingRight = false;
  self.pressingLeft = false;
  self.pressingUp = false;
  self.pressingDown = false;
  self.pressingAttack = false;
  self.mouseAngle = 0;
  self.maxSpd = 10;

  var super_update = self.update;
  self.update = function() {
    self.updateSpd();
    super_update();
    if (self.pressingAttack) {
      self.shootBullet(self.mouseAngle);
    }
  };

  self.shootBullet = function(angle) {
    var b = Bullet(self.id, angle);
    b.x = self.x;
    b.y = self.y;
  };

  self.updateSpd = function() {
    if (self.pressingRight) self.spdX = self.maxSpd;
    else if (self.pressingLeft) self.spdX = -self.maxSpd;
    else self.spdX = 0;

    if (self.pressingUp) self.spdY = -self.maxSpd;
    else if (self.pressingDown) self.spdY = self.maxSpd;
    else self.spdY = 0;
  };
  Player.list[id] = self;
  return self;
};

Player.list = {};

Player.onConnect = function(socket) {
  var player = Player(socket.id);
  socket.on('keyPress', function(data) {
    if (data.inputId === 'left') player.pressingLeft = data.state;
    else if (data.inputId === 'right') player.pressingRight = data.state;
    else if (data.inputId === 'up') player.pressingUp = data.state;
    else if (data.inputId === 'down') player.pressingDown = data.state;
    else if (data.inputId === 'attack') player.pressingAttack = data.state;
    else if (data.inputId === 'mouseAngle') player.mouseAngle = data.state;
  });
};

Player.onDisconnect = function(socket) {
  delete Player.list[socket.id];
};

Player.update = function() {
  var pack = [];
  for (var i in Player.list) {
    var player = Player.list[i];
    player.update();
    pack.push({
      x: player.x,
      y: player.y,
      number: player.number
    });
  }
  return pack;
};

var Bullet = function(parent, angle) {
  var self = Entity();
  self.id = Math.random();
  self.spdX = Math.cos((angle / 180) * Math.PI) * 10;
  self.spdY = Math.sin((angle / 180) * Math.PI) * 10;
  self.parent = parent;
  self.timer = 0;
  self.toRemove = false;
  var super_update = self.update;
  self.update = function() {
    if (self.timer++ > 100) self.toRemove = true;
    super_update();

    for (var i in Player.list) {
      var p = Player.list[i];
      if (self.getDistance(p) < 32 && self.parent !== p.id) {
        //handle collision. ex: hp--;
        self.toRemove = true;
      }
    }
  };
  Bullet.list[self.id] = self;
  return self;
};

Bullet.list = {};

Bullet.update = function() {
  var pack = [];
  for (var i in Bullet.list) {
    var bullet = Bullet.list[i];
    bullet.update();
    if (bullet.toRemove) {
      delete Bullet.list[i];
    } else
      pack.push({
        x: bullet.x,
        y: bullet.y
      });
  }
  return pack;
};

function getHash(str) {
  //   for (var i = 0, h = 0; i < str.length; i++) {
  //     h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  //   }
  h = pbkdf2.pbkdf2Sync(str, 'salt', 1, 32, 'sha512');
  return h;
}

function generatePasscode(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

var email;
var generateCode;

var recoverPassword = (data, cb) => {
  db.account.find({ username: data.username }, (err, res) => {
    if (res.length > 0) {
      email = data.email;
      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'kinggame4770@gmail.com',
          pass: 'comp4770'
        }
      });
      generateCode = generatePasscode(7);
      var mailOptions = {
        from: 'kinggame4770@gmail.com',
        to: email,
        subject: 'Password Recovery',
        text: 'Your new password is: ' + generateCode
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
      hashedPassword = getHash(generateCode);
      var myquery = { username: data.username };
      var newvalues = { $set: { username: data.username, password: hashedPassword } };
      db.account.update(myquery, newvalues, (err, res) => {
        if (err) throw err;
        // console.log('Username: ' + data.username);
        // console.log('Password: ' + password);
        // console.log(typeof hashedPassword);
        // console.log('Hashed Password: ' + hashedPassword);
      });
      cb(true);
    } else cb(false, { user: data.username });
  });
};

var changePassword = (data, cb) => {
  db.account.find({ username: data.user }, (err, res) => {
    if (res.length > 0) {
      password = data.password;
      hashedPassword = getHash(password);
      //   console.log('Username: ' + data.user);
      //   console.log('Password: ' + data.password);
      //   console.log('Password: ' + data.oldPassword);
      //   console.log(typeof hashedPassword);
      //   console.log('Hashed Password: ' + hashedPassword);
      var myquery = { username: data.user };
      var newvalues = { $set: { username: data.user, password: hashedPassword } };
      db.account.update(myquery, newvalues, (err, res) => {
        if (err) throw err;
      });
      cb(true);
    } else cb(false, { user: data.user });
  });
};

var isValidPassword = (data, cb) => {
  hashedPassword = getHash(data.password);
  db.account.find({ username: data.username, password: hashedPassword }, (err, res) => {
    if (res.length > 0) {
      cb(true, { user: data.username });
    } else cb(false);
  });
};

var isUsernameTaken = (data, cb) => {
  db.account.find({ username: data.username }, (err, res) => {
    if (res.length > 0) {
      cb(true);
    } else cb(false, { user: data.username });
  });
};

var isLevelnameTaken = (data, cb) => {
  db.level.find({ name: data.name }, (err, res) => {
    if (res.length > 0) {
      cb(true);
    } else cb(false);
  });
};

var getLevels = (data, cb) => {
  db.level.find({ user: data.user }).toArray((err, result) => {
    cb(result);
  });
};

var deleteLevels = (data, cb) => {
  db.level.find({ user: data.user }).toArray((err, result) => {
    db.level.remove({ user: data.user });
    // cb(result);
  });
};

var deleteOneLevel = (data, cb) => {
  db.level.find({ user: data.user, name: data.name }).toArray((err, result) => {
    db.level.remove({ user: data.user, name: data.name });
    // cb(result);
  });
};

var addUser = (data, cb) => {
  hashedPassword = getHash(data.password);
  db.account.insert({ username: data.username, password: hashedPassword }, err => {
    if (!err) {
      console.log(hashedPassword);
      cb();
    } else {
      console.log('Error: ', err);
    }
  });
};

var addLevel = (data, cb) => {
  db.level.insert(
    {
      user: data.user,
      name: data.name,
      tileArray: data.tileArray,
      backgroundImage: data.backgroundImage
    },
    function(err) {
      cb();
    }
  );
};

// var updateScore = (data, cb) => {
//   var myquery = { username: data.username };
//   var newvalues = { $set: { username: data.username, password: hashedPassword , score} };
//   db.account.update(myquery, newvalues, (err, res) => {
//     if (err) throw err;
//     // console.log('Username: ' + data.username);
//     // console.log('Password: ' + password);
//     // console.log(typeof hashedPassword);
//     // console.log('Hashed Password: ' + hashedPassword);
//   });
// };

var io = require('socket.io')(serv, {});
io.sockets.on('connection', socket => {
  socket.id = Math.random();
  SOCKET_LIST[socket.id] = socket;
  // create a player with a socket id

  socket.on('signIn', data => {
    isValidPassword(data, (res, user) => {
      if (res) {
        Player.onConnect(socket);
        socket.emit('signInResponse', { success: true, user: user.user });
      } else {
        socket.emit('signInResponse', { success: false });
      }
    });
  });

  socket.on('signUp', data => {
    isUsernameTaken(data, (res, user) => {
      if (res) {
        socket.emit('signUpResponse', { success: false });
      } else {
        if (data.username != '') {
          if (data.password != '') {
            addUser(data, () => {
              socket.emit('signUpResponse', { success: true, user: user.user });
            });
          } else socket.emit('emptyPasswordResponse', { success: false });
        } else socket.emit('checkEmptyResponse', { success: false });
      }
    });
  });

  socket.on('recoverPassword', data => {
    email = data.email;
    recoverPassword(data, (res, user) => {
      if (res) {
        socket.emit('recoverPasswordResponse', { success: true });
      } else {
        socket.emit('recoverPasswordResponse', { success: false });
      }
    });
  });

  socket.on('saveLevel', data => {
    isLevelnameTaken(data, res => {
      if (res) {
        socket.emit('saveLevelResponse', { success: false });
      } else {
        addLevel(data, () => {
          socket.emit('saveLevelResponse', { success: true });
        });
      }
    });
  });

  socket.on('deleteLevel', data => {
    deleteLevels(data, res => {
      if (res) {
        socket.emit('deleteLevelResponse', { success: true });
      } else {
        socket.emit('deleteLevelResponse', { success: false });
      }
    });
  });

  socket.on('deleteOneLevel', data => {
    deleteOneLevel(data, res => {
      if (res) {
        socket.emit('deleteOneLevelResponse', { success: true });
      } else {
        socket.emit('deleteOneLevelResponse', { success: false });
      }
    });
  });

  socket.on('newPassword', data => {
    changePassword(data, res => {
      if (res) {
        socket.emit('savePasswordResponse', { success: true });
      } else {
        socket.emit('savePasswordResponse', { success: false });
      }
    });
  });

  socket.on('requestLevels', data => {
    getLevels(data, res => {
      socket.emit('levelsResponse', {
        success: true,
        levels: res
      });
    });
  });

  socket.emit('serverMsg', {
    msg: 'hello'
  });

  socket.on('disconnect', () => {
    delete SOCKET_LIST[socket.id];
    Player.onDisconnect(socket);
  });
});

setInterval(() => {
  var pack = {
    player: Player.update(),
    bullet: Bullet.update()
  };
  for (var i in SOCKET_LIST) {
    var socket = SOCKET_LIST[i];
    socket.emit('newPositions', pack);
  }
}, 1000 / 25);
