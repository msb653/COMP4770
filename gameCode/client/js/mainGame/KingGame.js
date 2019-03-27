//Main Class of King Game

function KingGame() {
  var gameUI = GameUI.getInstance();

  var maxWidth; //width of the game world
  var height;
  var viewPort; //width of canvas, viewPort that can be seen
  var tileSize;
  var map;
  var originalMaps;

  var translatedDist; //distance translated(side scrolled) as king moves to the right
  var centerPos; //center position of the viewPort, viewable screen
  var kingInGround;

  //instances
  var king;
  var element;
  var gameSound;
  var score;
  var sound;

  var keys;
  var doorKeys;
  var enemies;
  var powerUps;
  var bullets;
  var bulletFlag = false;

  var currentLevel;

  var animationID;
  var timeOutId;

  var tickCounter = 0; //for animating king
  var maxTick = 25; //max number for ticks to show king sprite
  var instructionTick = 0; //showing instructions counter
  var that = this;

  this.init = function(levelMaps, level) {
    height = 480;
    maxWidth = 0;
    viewPort = 1280;
    tileSize = 32;
    translatedDist = 0;
    enemies = [];
    sound = true;
    powerUps = [];
    bullets = [];
    keys = [];
    doorKeys = [];

    gameUI.setWidth(viewPort);
    gameUI.setHeight(height);
    gameUI.show();

    currentLevel = level;
    originalMaps = levelMaps;
    map = JSON.parse(levelMaps[currentLevel]);

    if (!score) {
      //so that when level changes, it uses the same instance
      score = new Score();
      score.init();
    }
    score.displayScore();
    score.updateLevelNum(currentLevel);

    for (var row = 0; row < map.length; row++) {
      for (var column = 0; column < map[row].length; column++) {
        switch (map[row][column]) {
          case 11: //Key
            doorKeys.push(1);
            break;
        }
      }
    }

    if (!king) {
      //so that when level changes, it uses the same instance
      king = new King();
      king.init();
    } else {
      king.x = 10;
      king.frame = 0;
    }
    element = new Element();
    gameSound = new GameSound();
    gameSound.init();

    that.calculateMaxWidth();
    that.bindKeyPress();
    that.startGame();
  };

  that.calculateMaxWidth = function() {
    //calculates the max width of the game according to map size
    for (var row = 0; row < map.length; row++) {
      for (var column = 0; column < map[row].length; column++) {
        if (maxWidth < map[row].length * 32) {
          maxWidth = map[column].length * 32;
        }
      }
    }
  };

  that.bindKeyPress = function() {
    var canvas = gameUI.getCanvas(); //for use with touch events

    //key binding
    document.body.addEventListener('keydown', function(e) {
      keys[e.keyCode] = true;
    });

    document.body.addEventListener('keyup', function(e) {
      keys[e.keyCode] = false;
    });

    //key binding for touch events
    canvas.addEventListener('touchstart', function(e) {
      var touches = e.changedTouches;
      e.preventDefault();

      for (var i = 0; i < touches.length; i++) {
        if (touches[i].pageX <= 200) {
          keys[37] = true; //left arrow
        }
        if (touches[i].pageX > 200 && touches[i].pageX < 400) {
          keys[39] = true; //right arrow
        }
        if (touches[i].pageX > 640 && touches[i].pageX <= 1080) {
          //in touch events, same area acts as sprint and bullet key
          keys[16] = true; //shift key
          keys[17] = true; //ctrl key
        }
        if (touches[i].pageX > 1080 && touches[i].pageX < 1280) {
          keys[32] = true; //space
        }
      }
    });

    canvas.addEventListener('touchend', function(e) {
      var touches = e.changedTouches;
      e.preventDefault();

      for (var i = 0; i < touches.length; i++) {
        if (touches[i].pageX <= 200) {
          keys[37] = false;
        }
        if (touches[i].pageX > 200 && touches[i].pageX <= 640) {
          keys[39] = false;
        }
        if (touches[i].pageX > 640 && touches[i].pageX <= 1080) {
          keys[16] = false;
          keys[17] = false;
        }
        if (touches[i].pageX > 1080 && touches[i].pageX < 1280) {
          keys[32] = false;
        }
      }
    });

    canvas.addEventListener('touchmove', function(e) {
      var touches = e.changedTouches;
      e.preventDefault();

      for (var i = 0; i < touches.length; i++) {
        if (touches[i].pageX <= 200) {
          keys[37] = true;
          keys[39] = false;
        }
        if (touches[i].pageX > 200 && touches[i].pageX < 400) {
          keys[39] = true;
          keys[37] = false;
        }
        if (touches[i].pageX > 640 && touches[i].pageX <= 1080) {
          keys[16] = true;
          keys[32] = false;
        }
        if (touches[i].pageX > 1080 && touches[i].pageX < 1280) {
          keys[32] = true;
          keys[16] = false;
          keys[17] = false;
        }
      }
    });
  };

  //Main Game Loop
  this.startGame = function() {
    animationID = window.requestAnimationFrame(that.startGame);

    gameUI.clear(0, 0, maxWidth, height);

    if (instructionTick < 1000) {
      that.showInstructions(); //showing control instructions
      instructionTick++;
    }

    that.renderMap();

    for (var i = 0; i < powerUps.length; i++) {
      powerUps[i].draw();
      powerUps[i].update();
    }

    for (var i = 0; i < bullets.length; i++) {
      bullets[i].draw();
      bullets[i].update();
    }

    for (let i = 0; i < enemies.length; i++) {
      enemies[i].draw();
      enemies[i].update();
      // We only want the enemy to shoot if they're alive, have a ranged attack and are within range
      if (enemies[i].rangedAttack == true && (enemies[i].x - king.x < 500 || king.x - enemies[i] < 500) && enemies[i].state != 'dead') {
        if (!enemies[i].bulletFlag) {
          // Only shoot if their flag is false
          enemies[i].bulletFlag = true;
          var bullet = new Bullet();
          bullet.enemy = 1; // make the bullet hostile
          bullet.changeType('fireball'); // specify that the bullet is a fireball

          if (enemies[i].x < king.x) {
            // Shoot left or right depending on the position on the king
            bullet.init(enemies[i].x, enemies[i].y, 1);
          } else {
            bullet.init(enemies[i].x, enemies[i].y, -1);
          }
          bullets.push(bullet);
          // Play fireball audio
          if (sound) {
            gameSound.play('fireball');
          }

          // Make the enemy wait until they can fire again
          (function(index) {
            setTimeout(function() {
              enemies[i].bulletFlag = false;
            }, enemies[i].fireRate);
          })(i);
        }
      }
    }

    that.checkPowerUpKingCollision();
    that.checkBulletEnemyCollision();
    that.checkBulletAllyCollision();
    that.checkEnemyKingCollision();

    king.draw();
    that.updateKing();
    that.wallCollision();
    kingInGround = king.grounded; //for use with flag sliding
  };

  this.showInstructions = function() {
    gameUI.writeText('Use the arrow keys to move, and ctrl to attack.');
  };

  this.renderMap = function() {
    //setting false each time the map renders so that elements fall off a platform and not hover around
    king.grounded = false;

    for (var i = 0; i < powerUps.length; i++) {
      powerUps[i].grounded = false;
    }
    for (var i = 0; i < enemies.length; i++) {
      enemies[i].grounded = false;
    }

    for (var row = 0; row < map.length; row++) {
      for (var column = 0; column < map[row].length; column++) {
        switch (map[row][column]) {
          case 1: //castle platform
            element.x = column * tileSize;
            element.y = row * tileSize;
            element.castlePlatform();
            element.draw();

            that.checkElementKingCollision(element, row, column);
            that.checkElementPowerUpCollision(element);
            that.checkElementEnemyCollision(element);
            that.checkElementBulletCollision(element);
            break;

          case 2: //forest platform
            element.x = column * tileSize;
            element.y = row * tileSize;
            element.forestPlatform();
            element.draw();

            that.checkElementKingCollision(element, row, column);
            that.checkElementPowerUpCollision(element);
            that.checkElementEnemyCollision(element);
            that.checkElementBulletCollision(element);
            break;

          case 3: //cave platform
            element.x = column * tileSize;
            element.y = row * tileSize;
            element.cavePlatform();
            element.draw();

            that.checkElementKingCollision(element, row, column);
            that.checkElementPowerUpCollision(element);
            that.checkElementEnemyCollision(element);
            that.checkElementBulletCollision(element);
            break;

          case 4: //lava platform
            element.x = column * tileSize;
            element.y = row * tileSize;
            element.lavaPlatform();
            element.draw();

            that.checkElementKingCollision(element, row, column);
            that.checkElementPowerUpCollision(element);
            that.checkElementEnemyCollision(element);
            that.checkElementBulletCollision(element);
            break;

          case 5: // Chest
            element.x = column * tileSize;
            element.y = row * tileSize;
            element.chest();
            element.draw();

            that.checkElementKingCollision(element, row, column);
            that.checkElementPowerUpCollision(element);
            that.checkElementEnemyCollision(element);
            that.checkElementBulletCollision(element);

            break;

          case 6: //Open chest
            element.x = column * tileSize;
            element.y = row * tileSize;
            element.openChest();
            element.draw();

            that.checkElementKingCollision(element, row, column);
            that.checkElementPowerUpCollision(element);
            that.checkElementEnemyCollision(element);
            that.checkElementBulletCollision(element);
            break;

          case 7: //Sword
            element.x = column * tileSize;
            element.y = row * tileSize;
            element.sword();
            element.draw();

            that.checkElementKingCollision(element, row, column);
            that.checkElementPowerUpCollision(element);
            that.checkElementEnemyCollision(element);
            that.checkElementBulletCollision(element);
            break;

          case 8: //Bow
            element.x = column * tileSize;
            element.y = row * tileSize;
            element.bow();
            element.draw();

            that.checkElementKingCollision(element, row, column);
            that.checkElementPowerUpCollision(element);
            that.checkElementEnemyCollision(element);
            that.checkElementBulletCollision(element);
            break;

          case 9: //Staff
            element.x = column * tileSize;
            element.y = row * tileSize;
            element.staff();
            element.draw();

            that.checkElementKingCollision(element, row, column);
            that.checkElementPowerUpCollision(element);
            that.checkElementEnemyCollision(element);
            that.checkElementBulletCollision(element);
            break;

          case 10: //Arrow
            element.x = column * tileSize;
            element.y = row * tileSize;
            element.arrow();
            element.draw();

            that.checkElementKingCollision(element, row, column);
            that.checkElementPowerUpCollision(element);
            that.checkElementEnemyCollision(element);
            that.checkElementBulletCollision(element);
            break;

          case 11: //Key
            element.x = column * tileSize;
            element.y = row * tileSize;
            element.key();
            element.draw();

            that.checkElementKingCollision(element, row, column);
            break;

          case 12: //Door
            element.x = column * tileSize;
            element.y = row * tileSize;
            element.door();
            element.draw();
            if (doorKeys.length == 0) {
              map[row][column] = 10;
            }

            break;

          case 13: //Open Door
            element.x = column * tileSize;
            element.y = row * tileSize;
            element.openDoor();
            element.draw();

            that.checkElementKingCollision(element, row, column);
            that.checkElementPowerUpCollision(element);
            that.checkElementEnemyCollision(element);
            that.checkElementBulletCollision(element);
            break;

          case 14: //Gem
            element.x = column * tileSize;
            element.y = row * tileSize;
            element.gem();
            element.draw();

            that.checkElementKingCollision(element, row, column);
            break;

          case 20: // Wizard
            var enemy = new Enemy();
            enemy.wizard();
            enemy.x = column * tileSize;
            enemy.y = row * tileSize;
            enemy.draw();

            enemies.push(enemy);
            map[row][column] = 0;
        }
      }
    }
  };

  this.collisionCheck = function(objA, objB) {
    // get the vectors to check against
    var vX = objA.x + objA.width / 2 - (objB.x + objB.width / 2);
    var vY = objA.y + objA.height / 2 - (objB.y + objB.height / 2);

    // add the half widths and half heights of the objects
    var hWidths = objA.width / 2 + objB.width / 2;
    var hHeights = objA.height / 2 + objB.height / 2;
    var collisionDirection = null;

    // if the x and y vector are less than the half width or half height, then we must be inside the object, causing a collision
    if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
      // figures out on which side we are colliding (top, bottom, left, or right)
      var offsetX = hWidths - Math.abs(vX);
      var offsetY = hHeights - Math.abs(vY);

      if (offsetX >= offsetY) {
        if (vY > 0 && vY < 37) {
          collisionDirection = 't';
          if (objB.type != 5) {
            //if flagpole then pass through it
            objA.y += offsetY;
          }
        } else if (vY < 0) {
          collisionDirection = 'b';
          if (objB.type != 5) {
            //if flagpole then pass through it
            objA.y -= offsetY;
          }
        }
      } else {
        if (vX > 0) {
          collisionDirection = 'l';
          objA.x += offsetX;
        } else {
          collisionDirection = 'r';
          objA.x -= offsetX;
        }
      }
    }
    return collisionDirection;
  };

  this.checkElementKingCollision = function(element, row, column) {
    var collisionDirection = that.collisionCheck(king, element);

    if (collisionDirection == 'l' || collisionDirection == 'r') {
      king.velX = 0;
      king.jumping = false;
    } else if (collisionDirection == 'b') {
      king.grounded = true;
      king.jumping = false;
    } else if (collisionDirection == 't') {
      king.velY *= -1;
      if (element.type == 5) {
        var powerUp = new PowerUp();
        if (king.type == 'small') {
          powerUp.crown(element.x, element.y);
          powerUps.push(powerUp);
        }
        map[row][column] = 6;
      }
    }

    // Check collision for keys and gems
    if (collisionDirection == 'l' || collisionDirection == 'r' || collisionDirection == 'b' || collisionDirection == 't') {
      // Remove keys upon collision, and update the doorKeys array
      if (element.type == 11) {
        map[row][column] = 0;
        doorKeys.pop();
      }

      if (element.type == 14) {
        map[row][column] = 0;
        score.coinScore++;
        score.totalScore += 100;

        score.updateCoinScore();
        score.updateTotalScore();
      }
    }
  };

  this.checkElementPowerUpCollision = function(element) {
    for (var i = 0; i < powerUps.length; i++) {
      var collisionDirection = that.collisionCheck(powerUps[i], element);

      if (collisionDirection == 'l' || collisionDirection == 'r') {
        powerUps[i].velX *= -1; //change direction if collision with any element from the sidr
      } else if (collisionDirection == 'b') {
        powerUps[i].grounded = true;
      }
    }
  };

  this.checkElementEnemyCollision = function(element) {
    for (var i = 0; i < enemies.length; i++) {
      if (enemies[i].state != 'dead') {
        //so that enemies fall from the map when they die
        var collisionDirection = that.collisionCheck(enemies[i], element);

        if (collisionDirection == 'l' || collisionDirection == 'r') {
          enemies[i].velX *= -1;
        } else if (collisionDirection == 'b') {
          enemies[i].grounded = true;
        }
      }
    }
  };

  this.checkElementBulletCollision = function(element) {
    for (var i = 0; i < bullets.length; i++) {
      var collisionDirection = that.collisionCheck(bullets[i], element);

      if (collisionDirection == 'b') {
        //if collision is from bottom of the bullet, it is grounded, so that it can be bounced
        bullets[i].grounded = true;
      } else if (collisionDirection == 't' || collisionDirection == 'l' || collisionDirection == 'r') {
        bullets.splice(i, 1);
      }
    }
  };

  this.checkPowerUpKingCollision = function() {
    for (var i = 0; i < powerUps.length; i++) {
      var collWithKing = that.collisionCheck(powerUps[i], king);
      if (collWithKing) {
        if (powerUps[i].type == 30 && king.type == 'small') {
          //mushroom
          king.type = 'big';
        } else if (powerUps[i].type == 31) {
          //flower
          king.type = 'fire';
        }
        powerUps.splice(i, 1);

        score.totalScore += 1000;
        score.updateTotalScore();

        if (sound) {
          gameSound.play('powerUp');
        }
      }
    }
  };

  this.checkEnemyKingCollision = function() {
    for (var i = 0; i < enemies.length; i++) {
      if (!king.invulnerable && enemies[i].state != 'dead') {
        //if king is invulnerable or enemies state is dead, collision doesnt occur
        var collWithKing = that.collisionCheck(enemies[i], king);

        if (collWithKing == 't') {
          //kill enemies if collision is from top
          enemies[i].state = 'dead';

          king.velY = -king.speed;

          score.totalScore += 1000;
          score.updateTotalScore();

          //sound when enemy dies
          if (sound) {
            gameSound.play('killEnemy');
          }
        } else if (collWithKing == 'r' || collWithKing == 'l' || collWithKing == 'b') {
          enemies[i].velX *= -1;

          if (king.type == 'big') {
            king.type = 'small';
            king.invulnerable = true;
            collWithKing = undefined;

            //sound when king powerDowns
            if (sound) {
              gameSound.play('powerDown');
            }

            setTimeout(function() {
              king.invulnerable = false;
            }, 1000);
          } else if (king.type == 'fire') {
            king.type = 'big';
            king.invulnerable = true;

            collWithKing = undefined;

            //sound when king powerDowns
            if (sound) {
              gameSound.play('powerDown');
            }

            setTimeout(function() {
              king.invulnerable = false;
            }, 1000);
          } else if (king.type == 'small') {
            //kill king if collision occurs when he is small
            that.pauseGame();

            king.frame = 0;
            collWithKing = undefined;

            score.lifeCount--;
            score.updateLifeCount();

            //sound when king dies
            if (sound) {
              gameSound.play('kingDie');
            }

            timeOutId = setTimeout(function() {
              if (score.lifeCount == 0) {
                that.gameOver();
              } else {
                that.resetGame();
              }
            }, 3000);
            break;
          }
        }
      }
    }
  };

  this.checkBulletEnemyCollision = function() {
    for (var i = 0; i < enemies.length; i++) {
      for (var j = 0; j < bullets.length; j++) {
        if (enemies[i] && enemies[i].state != 'dead' && bullets[j].enemy != 1) {
          //check for collision only if enemies exist and is not dead
          var collWithBullet = that.collisionCheck(enemies[i], bullets[j]);
        }

        if (collWithBullet) {
          bullets[j] = null;
          bullets.splice(j, 1);

          enemies[i].state = 'dead';

          score.totalScore += 1000;
          score.updateTotalScore();

          //sound when enemy dies
          if (sound) {
            gameSound.play('killEnemy');
          }
        }
      }
    }
  };

  this.checkBulletAllyCollision = function() {
    for (var j = 0; j < bullets.length; j++) {
      if (bullets[j].enemy != 0) {
        var collWithBullet = that.collisionCheck(king, bullets[j]);
      }

      if (collWithBullet) {
        bullets[j] = null;
        bullets.splice(j, 1);

        if (king.type == 'big') {
          king.type = 'small';
          king.invulnerable = true;
          collWithKing = undefined;

          //sound when king powerDowns
          if (sound) {
            gameSound.play('powerDown');
          }

          setTimeout(function() {
            king.invulnerable = false;
          }, 1000);
        } else if (king.type == 'fire') {
          king.type = 'big';
          king.invulnerable = true;

          collWithKing = undefined;

          //sound when king powerDowns
          if (sound) {
            gameSound.play('powerDown');
          }

          setTimeout(function() {
            king.invulnerable = false;
          }, 1000);
        } else if (king.type == 'small') {
          //kill king if collision occurs when he is small
          that.pauseGame();

          king.frame = 0;
          collWithKing = undefined;

          score.lifeCount--;
          score.updateLifeCount();

          //sound when king dies
          if (sound) {
            gameSound.play('kingDie');
          }

          timeOutId = setTimeout(function() {
            if (score.lifeCount == 0) {
              that.gameOver();
            } else {
              that.resetGame();
            }
          }, 3000);
          break;
        }
      }
    }
  };

  this.wallCollision = function() {
    //for walls (vieport walls)
    if (king.x >= maxWidth - king.width) {
      king.x = maxWidth - king.width;
    } else if (king.x <= translatedDist) {
      king.x = translatedDist + 1;
    }

    //for ground (viewport ground)
    if (king.y >= height) {
      that.pauseGame();

      //sound when king dies
      if (sound) {
        gameSound.play('kingDie');
      }

      score.lifeCount--;
      score.updateLifeCount();

      timeOutId = setTimeout(function() {
        if (score.lifeCount == 0) {
          that.gameOver();
        } else {
          that.resetGame();
        }
      }, 3000);
    }
  };

  //controlling king with key events
  this.updateKing = function() {
    var friction = 0.9;
    var gravity = 0.2;

    king.checkKingType();

    if (keys[38] || keys[32]) {
      //up arrow
      if (!king.jumping && king.grounded) {
        king.jumping = true;
        king.grounded = false;
        king.velY = -(king.speed / 2 + 5.5);

        //sound when king jumps
        if (sound) {
          gameSound.play('jump');
        }
      }
    }

    if (keys[39]) {
      //right arrow
      that.checkKingPos(); //if king goes to the center of the screen, sidescroll the map

      if (king.velX < king.speed) {
        king.velX++;
      }

      //king sprite position
      if (!king.jumping) {
        tickCounter += 1;

        if (tickCounter > maxTick / king.speed) {
          tickCounter = 0;

          if (king.frame != 0) {
            king.frame = 0;
          } else {
            king.frame = 0;
          }
        }
      }
    }

    if (keys[37]) {
      //left arrow
      if (king.velX > -king.speed) {
        king.velX--;
      }

      //king sprite position
      if (!king.jumping) {
        tickCounter += 1;

        if (tickCounter > maxTick / king.speed) {
          tickCounter = 0;

          if (king.frame != 0) {
            king.frame = 0;
          } else {
            king.frame = 0;
          }
        }
      }
    }

    if (keys[16]) {
      //shift key
      king.speed = 4.5;
    } else {
      king.speed = 3;
    }

    if (keys[83]) {
      //s key
      sound = !sound;
      if (sound == true) {
        alert('sound unmuted');
      } else {
        alert('sound muted');
      }
      keys[83] = false;
    }

    if ((keys[17] && king.weapon == 'bow') || king.weapon == 'staff') {
      //ctrl key
      if (!bulletFlag) {
        bulletFlag = true;
        var bullet = new Bullet();
        if (king.velX >= 0) {
          var direction = 1;
        } else {
          var direction = -1;
        }
        bullet.init(king.x, king.y, direction);
        bullets.push(bullet);

        //bullet sound
        if (sound) {
          gameSound.play('bullet');
        }

        setTimeout(function() {
          bulletFlag = false; //only lets king fire bullet after 500ms
        }, 500);
      }
    }

    //velocity 0 sprite position
    if (king.velX > 0 && king.velX < 1 && !king.jumping) {
      king.frame = 0;
    } else if (king.velX > -1 && king.velX < 0 && !king.jumping) {
      king.frame = 0;
    }

    if (king.grounded) {
      king.velY = 0;

      //grounded sprite position
      if (king.frame == 0) {
        king.frame = 0; //looking right
      } else if (king.frame == 0) {
        king.frame = 0; //looking left
      }
    }

    //change king position
    king.velX *= friction;
    king.velY += gravity;

    king.x += king.velX;
    king.y += king.velY;
  };

  this.checkKingPos = function() {
    centerPos = translatedDist + viewPort / 2;

    //side scrolling as king reaches center of the viewPort
    if (king.x > centerPos && centerPos + viewPort / 2 < maxWidth) {
      gameUI.scrollWindow(-king.speed, 0);
      translatedDist += king.speed;
    }
  };

  this.levelFinish = function(collisionDirection) {
    //game finishes when king slides the flagPole and collides with the ground
    if (collisionDirection == 'r') {
      king.x += 10;
      king.velY = 2;
      king.frame = 0;
    } else if (collisionDirection == 'l') {
      king.x -= 32;
      king.velY = 2;
      king.frame = 0;
    }

    if (kingInGround) {
      king.x += 20;
      king.frame = 0;
      tickCounter += 1;
      if (tickCounter > maxTick) {
        that.pauseGame();

        king.x += 10;
        tickCounter = 0;
        king.frame = 0;

        //sound when stage clears
        if (sound) {
          gameSound.play('stageClear');
        }

        timeOutId = setTimeout(function() {
          currentLevel++;
          if (originalMaps[currentLevel]) {
            that.init(originalMaps, currentLevel);
            score.updateLevelNum(currentLevel);
          } else {
            that.gameOver();
          }
        }, 5000);
      }
    }
  };

  this.pauseGame = function() {
    window.cancelAnimationFrame(animationID);
  };

  this.gameOver = function() {
    // Play game over audio
    if (sound) {
      gameSound.play('gameOver');
    }
    score.gameOverView();
    gameUI.makeBox(0, 0, maxWidth, height);
    gameUI.writeText('Game Over', centerPos - 80, height - 300);
  };

  this.resetGame = function() {
    that.clearInstances();
    that.init(originalMaps, currentLevel);
  };

  this.clearInstances = function() {
    king = null;
    element = null;
    gameSound = null;

    enemies = [];
    bullets = [];
    powerUps = [];
  };

  this.clearTimeOut = function() {
    clearTimeout(timeOutId);
  };

  this.removeGameScreen = function() {
    gameUI.hide();

    if (score) {
      score.hideScore();
    }
  };

  this.showGameScreen = function() {
    gameUI.show();
  };
}
