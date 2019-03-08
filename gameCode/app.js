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
var serv = require('http').Server(app);

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/client/index.html');
});
app.get('/gameCode/client/gameMenu.html', function (req, res) {
    res.sendFile(__dirname + '/client/gameMenu.html');
});
app.get('/gameCode/client/levelEditor.html', function (req, res) {
    res.sendFile(__dirname + '/client/levelEditor.html');
});
app.get('/gameCode/client/loadLevel.html', function (req, res) {
    res.sendFile(__dirname + '/client/loadLevel.html');
});
app.get('/gameCode/client/campaignMode.html', function (req, res) {
    res.sendFile(__dirname + '/client/campaignMode.html');
});
app.get('/gameCode/client/gameMenuStyle.css', function (req, res) {
    res.sendFile(__dirname + '/client/gameMenuStyle.css');
});
app.get('/gameCode/client/campaign.css', function (req, res) {
    res.sendFile(__dirname + '/client/campaign.css');
});
app.get('/gameCode/client/levelEditor.css', function (req, res) {
    res.sendFile(__dirname + '/client/LevelEditor.css');
});

//Images
app.get('/gameCode/client/images/menuBackground.jpg', function (req, res) {
    res.sendFile(__dirname + '/client/images/menuBackground.jpg');
});
app.get('/gameCode/client/images/avatar.png', function (req, res) {
    res.sendFile(__dirname + '/client/images/avatar.png');
});
app.get('/gameCode/client/images/shoot.png', function (req, res) {
    res.sendFile(__dirname + '/client/images/shoot.png');
});
app.get('/gameCode/client/images/castleTiles.png', function (req, res) {
    res.sendFile(__dirname + '/client/images/castleTiles.png');
});
app.get('/gameCode/client/images/dark_forest.png', function (req, res) {
    res.sendFile(__dirname + '/client/images/dark_forest.png');
});
app.get('/gameCode/client/images/underwater.png', function (req, res) {
    res.sendFile(__dirname + '/client/images/underwater.png');
});
app.get('/gameCode/client/images/cave.png', function (req, res) {
    res.sendFile(__dirname + '/client/images/cave.png');
});
app.get('/gameCode/client/images/cave_tileset.png', function (req, res) {
    res.sendFile(__dirname + '/client/images/cave_tileset.png');
});
app.use('/client', express.static(__dirname + '/client'));

serv.listen(2000);
console.log('Server started.');

var SOCKET_LIST = {};

var Entity = function () {
    var self = {
        x: 250,
        y: 250,
        spdX: 0,
        spdY: 0,
        id: ''
    };
    self.update = function () {
        self.updatePosition();
    };
    self.updatePosition = function () {
        self.x += self.spdX;
        self.y += self.spdY;
    };
    self.getDistance = function (pt) {
        return Math.sqrt(Math.pow(self.x - pt.x, 2) + Math.pow(self.y - pt.y, 2));
    };
    return self;
};

var Player = function (id) {
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
    self.update = function () {
        self.updateSpd();
        super_update();
        if (self.pressingAttack) {
            self.shootBullet(self.mouseAngle);
        }
    };

    self.shootBullet = function (angle) {
        var b = Bullet(self.id, angle);
        b.x = self.x;
        b.y = self.y;
    };

    self.updateSpd = function () {
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

Player.onConnect = function (socket) {
    var player = Player(socket.id);
    socket.on('keyPress', function (data) {
        if (data.inputId === 'left') player.pressingLeft = data.state;
        else if (data.inputId === 'right') player.pressingRight = data.state;
        else if (data.inputId === 'up') player.pressingUp = data.state;
        else if (data.inputId === 'down') player.pressingDown = data.state;
        else if (data.inputId === 'attack') player.pressingAttack = data.state;
        else if (data.inputId === 'mouseAngle') player.mouseAngle = data.state;
    });
};

Player.onDisconnect = function (socket) {
    delete Player.list[socket.id];
};

Player.update = function () {
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

var Bullet = function (parent, angle) {
    var self = Entity();
    self.id = Math.random();
    self.spdX = Math.cos((angle / 180) * Math.PI) * 10;
    self.spdY = Math.sin((angle / 180) * Math.PI) * 10;
    self.parent = parent;
    self.timer = 0;
    self.toRemove = false;
    var super_update = self.update;
    self.update = function () {
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

Bullet.update = function () {
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

var isValidPassword = function (data, cb) {
    db.account.find(
        { username: data.username, password: data.password },
        function (err, res) {
            if (res.length > 0) {
                cb(true,{user: data.username});
            } else cb(false);
        }
    );
};

var isUsernameTaken = function (data, cb) {
    db.account.find({ username: data.username }, function (err, res) {
        if (res.length > 0) {
            cb(true,{user: data.username});
        } else cb(false);
    });
};

var isLevelnameTaken = function (data, cb) {
    db.level.find({ name: data.name }, function (err, res) {
        if (res.length > 0) {
            cb(true);
        } else cb(false);
    });
};

var getLevels = function (data, cb) {
    db.level.find({user: data.user}).toArray(function(err, result) {
    cb(result);
  });
};

var addUser = function (data, cb) {
    db.account.insert(
        { username: data.username, password: data.password },
        function (err) {
            cb();
        }
    );
};

var addLevel = function (data, cb) {
    db.level.insert(
        { 
            user: data.user,
            name: data.name,
            castleArray: data.castleArray,
            forestArray: data.forestArray,
            underwaterArray: data.underwaterArray,
            caveArray: data.caveArray,
            background: data.background
        },
        function (err) {
            cb();
        }
    );
};


var io = require('socket.io')(serv, {});
io.sockets.on('connection', function (socket) {
    socket.id = Math.random();
    SOCKET_LIST[socket.id] = socket;
    // create a player with a socket id

    socket.on('signIn', function (data) {
        isValidPassword(data, function (res,user) {
            if (res) {
                Player.onConnect(socket);
                socket.emit('signInResponse', { success: true, user: user.user });
            } else {
                socket.emit('signInResponse', { success: false });
            }
        });
    });

    socket.on('signUp', function (data) {
        isUsernameTaken(data, function (res,user) {
            if (res) {
                socket.emit('signUpResponse', { success: false, user: user.user });
            } else {
                addUser(data, function () {
                    socket.emit('signUpResponse', { success: true });
                });
            }
        });
    });

    socket.on('saveLevel', function (data) {
        isLevelnameTaken(data, function (res) {
            if (res) {
                socket.emit('saveLevelResponse', { success: false });
            } else {
                addLevel(data, function () {
                    socket.emit('saveLevelResponse', { success: true });
                });
            }
        });
    });

    socket.on('requestLevels', function (data) {
        getLevels(data, function(res){
            socket.emit('levelsResponse',{
                success: true,
                levels: res
            });
        });
    });

    socket.emit('serverMsg', {
        msg: 'hello'
    });

    socket.on('disconnect', function () {
        delete SOCKET_LIST[socket.id];
        Player.onDisconnect(socket);
    });
});

setInterval(function () {
    var pack = {
        player: Player.update(),
        bullet: Bullet.update()
    };
    for (var i in SOCKET_LIST) {
        var socket = SOCKET_LIST[i];
        socket.emit('newPositions', pack);
    }
}, 1000 / 25);
