//Main Class of King Game

function KingGame() {
  var gameUI = GameUI.getInstance();

  var maxWidth; //width of the game world
  var height;
  var viewPort; //width of canvas, viewPort that can be seen
  var tileSize;
  var map;
  var originalMaps;
  var diff;
  var translatedDist; //distance translated(side scrolled) as king moves to the right
  var centerPos; //center position of the viewPort, viewable screen
  var kingInGround;

  //instances
  var king;
  var element;
  var gameSound;
  var score;
  
  var keys;
  var doorKeys;
  var enemies;
  var powerUps;
  var kingBullets;
  var enemyBullets;
  var bulletFlag = false;

  var currentLevel;
  var gameScreen;

  var animationID;
  var timeOutId;

  var tickCounter = 0; //for animating king
  var maxTick = 25; //max number for ticks to show king sprite
  var instructionTick = 0; //showing instructions counter
  var that = this;

  var socket = io();

  this.init = function(levelMaps, level, gs) {
    height = 480;
    maxWidth = 0;
    viewPort = 1280;
    tileSize = 32;
    translatedDist = 0;
    enemies = [];
    powerUps = [];
    kingBullets = [];
    enemyBullets = [];
    keys = [];
    doorKeys = [];

    gameUI.setWidth(viewPort);
    gameUI.setHeight(height);
    gameUI.show();

    gameScreen = gs;

    currentLevel = level;
    originalMaps = levelMaps;
    map = JSON.parse(levelMaps[currentLevel]);

    if (!score) {
      //so that when level changes, it uses the same instance
      score = new Score();
      score.init();
    }
    score.displayScore();
    score.updateWeapon('none', -1);

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

    for (var i = 0; i < kingBullets.length; i++) {
    	kingBullets[i].draw();
      if (kingBullets[i].type == 'swordRight') {
    	  kingBullets[i].y = king.y + 15;
    	  kingBullets[i].x = king.x + kingBullets[i].width;
      }

      if (kingBullets[i].type == 'swordLeft') {
    	  kingBullets[i].y = king.y + 15;
    	  kingBullets[i].x = king.x - 20;
      }
      kingBullets[i].update();
    }
    
    for (var i = 0; i < enemyBullets.length; i++) {
		  enemyBullets[i].draw();
		  enemyBullets[i].update();
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

          var fireHeight = enemies[i].y;
          if (enemies[i].type == 24) {
            fireHeight = enemies[i].y + 64;
          }

          if (enemies[i].x < king.x) {
            // Shoot left or right depending on the position on the king
            bullet.init(enemies[i].x, fireHeight, 1);
          } else {
            bullet.init(enemies[i].x, fireHeight, -1);
          }
          enemyBullets.push(bullet);
          
          // Play fireball audio
            gameSound.play('fireball');

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
            that.checkElementBulletCollision(element, row, column);
            break;

          case 2: //forest platform
            element.x = column * tileSize;
            element.y = row * tileSize;
            element.forestPlatform();
            element.draw();

            that.checkElementKingCollision(element, row, column);
            that.checkElementPowerUpCollision(element);
            that.checkElementEnemyCollision(element);
            that.checkElementBulletCollision(element, row, column);
            break;

          case 3: //cave platform
            element.x = column * tileSize;
            element.y = row * tileSize;
            element.cavePlatform();
            element.draw();

            that.checkElementKingCollision(element, row, column);
            that.checkElementPowerUpCollision(element);
            that.checkElementEnemyCollision(element);
            that.checkElementBulletCollision(element, row, column);
            break;

          case 4: //lava platform
            element.x = column * tileSize;
            element.y = row * tileSize;
            element.lavaPlatform();
            element.draw();

            that.checkElementKingCollision(element, row, column);
            that.checkElementPowerUpCollision(element);
            that.checkElementEnemyCollision(element);
            that.checkElementBulletCollision(element, row, column);
            break;

          case 5: // Chest
            element.x = column * tileSize;
            element.y = row * tileSize;
            element.chest();
            element.draw();

            that.checkElementKingCollision(element, row, column);
            that.checkElementPowerUpCollision(element);
            that.checkElementEnemyCollision(element);
            that.checkElementBulletCollision(element, row, column);

            break;

          case 6: //Open chest
            element.x = column * tileSize;
            element.y = row * tileSize;
            element.openChest();
            element.draw();

            that.checkElementKingCollision(element, row, column);
            that.checkElementPowerUpCollision(element);
            that.checkElementEnemyCollision(element);
            that.checkElementBulletCollision(element, row, column);
            break;

          case 7: //Sword
            element.x = column * tileSize;
            element.y = row * tileSize;
            element.sword();
            element.draw();

            that.checkElementKingCollision(element, row, column);
            that.checkElementPowerUpCollision(element);
            that.checkElementEnemyCollision(element);
            that.checkElementBulletCollision(element, row, column);
            break;

          case 8: //Bow
            element.x = column * tileSize;
            element.y = row * tileSize;
            element.bow();
            element.draw();

            that.checkElementKingCollision(element, row, column);
            that.checkElementPowerUpCollision(element);
            that.checkElementEnemyCollision(element);
            that.checkElementBulletCollision(element, row, column);
            break;

          case 9: //Staff
            element.x = column * tileSize;
            element.y = row * tileSize;
            element.staff();
            element.draw();

            that.checkElementKingCollision(element, row, column);
            that.checkElementPowerUpCollision(element);
            that.checkElementEnemyCollision(element);
            that.checkElementBulletCollision(element, row, column);
            break;

          case 10: //Arrow
            element.x = column * tileSize;
            element.y = row * tileSize;
            element.arrow();
            element.draw();

            that.checkElementKingCollision(element, row, column);
            that.checkElementPowerUpCollision(element);
            that.checkElementEnemyCollision(element);
            that.checkElementBulletCollision(element, row, column);
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
            that.checkElementKingCollision(element, row, column);
            if (doorKeys.length == 0) {
              map[row][column] = 13;
              that.checkElementKingCollision(element, row, column);
            }

            break;

          case 13: //Open Door
            element.x = column * tileSize;
            element.y = row * tileSize;
            element.openDoor();
            element.draw();

            that.checkElementKingCollision(element, row, column);
            break;

          case 14: //Gem
            element.x = column * tileSize;
            element.y = row * tileSize;
            element.gem();
            element.draw();

            that.checkElementKingCollision(element, row, column);
            break;

          case 15: //dead guy
            element.x = column * tileSize;
            element.y = row * tileSize;
            element.dguy();
            element.draw();

            that.checkElementKingCollision(element, row, column);
            that.checkElementPowerUpCollision(element);
            that.checkElementEnemyCollision(element);
            that.checkElementBulletCollision(element);
            break;

          case 16: //teleporter
            element.x = column * tileSize;
            element.y = row * tileSize;
            element.teleporter();
            element.draw();
            that.checkElementKingCollision(element, row, column);
            break;

          case 17: //destroyer
            element.x = column * tileSize;
            element.y = row * tileSize;
            element.destroyer();
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
            break;

          case 21: // flyer(bat)
            var enemy = new Enemy();
            enemy.flyer();
            enemy.x = column * tileSize;
            enemy.y = row * tileSize;
            enemy.initialX = enemy.x;
            enemy.initialY = enemy.y;
            enemy.draw();

            enemies.push(enemy);
            map[row][column] = 0;
            break;

          case 22: // enemy 3
            var enemy = new Enemy();
            enemy.enemy3();
            enemy.x = column * tileSize;
            enemy.y = row * tileSize;
            enemy.initialX = enemy.x;
            enemy.initialY = enemy.y;
            enemy.draw();

            enemies.push(enemy);
            map[row][column] = 0;
            break;

          case 23: //crab
            var enemy = new Enemy();
            enemy.crab();
            enemy.x = column * tileSize;
            enemy.y = row * tileSize;
            enemy.initialX = enemy.x;
            enemy.initialY = enemy.y;
            enemy.draw();

            enemies.push(enemy);
            map[row][column] = 0;
            break;

          case 24: //boss
            var enemy = new Enemy();
            enemy.boss();
            enemy.x = column * tileSize;
            enemy.y = row * tileSize;
            enemy.initialX = enemy.x;
            enemy.initialY = enemy.y;
            enemy.draw();

            enemies.push(enemy);
            map[row][column] = 0;
            break;
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
      if (element.type != 12 && element.type != 13) {
        king.velX = 0;
        king.jumping = false;
      }
      if(element.type == 12){
        var modal = document.getElementById('myModal2');

        // Get the <span> element that closes the modal
        var span = document.getElementsByClassName('close')[0];

        // When the user clicks the button, open the modal

        modal.style.display = 'block';
        setTimeout(
            () => {
              modal.style.display = 'none';
            },
            4 * 1000
        );
        // When the user clicks on <span> (x), close the modal
        span.onclick = function() {
          modal.style.display = 'none';
        };

        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function(event) {
          if (event.target == modal) {
            modal.style.display = 'none';
          }
        };
       // map[row][column] = 0;
        gameSound.play('help');

        keys[39] = false;


      }

      if (element.type == 13) {
        that.levelFinish(collisionDirection);
      }
      if (element.type == 15) {
        var modal = document.getElementById('myModal2');

        // Get the <span> element that closes the modal
        var span = document.getElementsByClassName('close')[0];

        // When the user clicks the button, open the modal

        modal.style.display = 'block';
        setTimeout(
            () => {
              modal.style.display = 'none';
            },
            4 * 1000
        );
        // When the user clicks on <span> (x), close the modal
        span.onclick = function() {
          modal.style.display = 'none';
        };

        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function(event) {
          if (event.target == modal) {
            modal.style.display = 'none';
          }
        };
        map[row][column] = 15;
        gameSound.play('help');

        keys[39] = false;
      }

      if (element.type != 12 && element.type != 13) {
        king.velX = 0;
        king.jumping = false;
      }
    } else if (collisionDirection == 'b') {
      if (element.type != 12 && element.type != 13) {
        king.grounded = true;
        king.jumping = false;
      }
    } else if (collisionDirection == 't') {
      if (element.type != 12 && element.type != 13) {
        king.velY *= -1;
        if (element.type == 5) {
          var powerUp = new PowerUp();
          if (king.type == 'small') {
            powerUp.crown(element.x, element.y);
            powerUps.push(powerUp);
          }
          map[row][column] = 6;
        }
        //help

        if (element.type == 15) {
          map[row][column] = 15;
          gameSound.play('help');
          alert('Daddy please save me!');
        }
      }
    }

    // Check collision with collectibles
    if (collisionDirection == 'l' || collisionDirection == 'r' || collisionDirection == 'b' || collisionDirection == 't') {
      // Remove keys upon collision, and update the doorKeys array
      if (element.type == 11) {
        map[row][column] = 0;
        doorKeys.pop();
      }

      // Remove gems upon collision and update score
      if (element.type == 14) {
        map[row][column] = 0;
        score.coinScore++;
        score.totalScore += 100;

        score.updateCoinScore();
        score.updateTotalScore();
      }

      // Handle weapon pick ups
      if (element.type == 7 && score.coinScore >= 1) {
        // Sword
        king.hasSword = true;
        king.weapon = 'sword';
        score.updateWeapon('sword', -1);
        map[row][column] = 0;

        score.coinScore = score.coinScore - 2;
        score.totalScore += 110;

        score.updateCoinScore();
        score.updateTotalScore();
      }

      if (element.type == 7 && score.coinScore < 1) {
        var modal = document.getElementById('myModal5');

        // Get the <span> element that closes the modal
        var span = document.getElementsByClassName('close')[0];

        // When the user clicks the button, open the modal

        modal.style.display = 'block';
        setTimeout(
            () => {
              modal.style.display = 'none';
            },
            4 * 1000
        );
        // When the user clicks on <span> (x), close the modal
        span.onclick = function() {
          modal.style.display = 'none';
        };

        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function(event) {
          if (event.target == modal) {
            modal.style.display = 'none';
          }
        };
       // map[row][column] = 0;
        gameSound.play('help');

        keys[39] = false;

      }

      if (element.type == 8 && score.coinScore >= 5 ) {
        // Bow
        map[row][column] = 0;
        king.hasBow = true;
        king.weapon = 'bow';
        king.arrows = king.arrows + 10;
        score.updateWeapon('bow', king.arrows);
        score.coinScore = score.coinScore - 5;
        score.totalScore += 150;

        score.updateCoinScore();
        score.updateTotalScore();
      }

      if (element.type == 8 && score.coinScore < 5 ) { 
        var modal = document.getElementById('myModal4');

        // Get the <span> element that closes the modal
        var span = document.getElementsByClassName('close')[0];

        // When the user clicks the button, open the modal

        modal.style.display = 'block';
        setTimeout(
            () => {
              modal.style.display = 'none';
            },
            4 * 1000
        );
        // When the user clicks on <span> (x), close the modal
        span.onclick = function() {
          modal.style.display = 'none';
        };

        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function(event) {
          if (event.target == modal) {
            modal.style.display = 'none';
          }
        };
       // map[row][column] = 0;
        gameSound.play('help');

        keys[39] = false;
      }


      if (element.type == 9 && score.coinScore >= 10) {
        // Staff
        map[row][column] = 0;
        king.hasStaff = true;
        king.weapon = 'staff';
        score.updateWeapon('staff', -1);

        score.coinScore = score.coinScore - 10;
        score.totalScore += 200;

        score.updateCoinScore();
        score.updateTotalScore();
      }

      if (element.type == 9 && score.coinScore < 10) {
        // Staff
        var modal = document.getElementById('myModal3');

        // Get the <span> element that closes the modal
        var span = document.getElementsByClassName('close')[0];

        // When the user clicks the button, open the modal

        modal.style.display = 'block';
        setTimeout(
            () => {
              modal.style.display = 'none';
            },
            4 * 1000
        );
        // When the user clicks on <span> (x), close the modal
        span.onclick = function() {
          modal.style.display = 'none';
        };

        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function(event) {
          if (event.target == modal) {
            modal.style.display = 'none';
          }
        };
       // map[row][column] = 0;
        gameSound.play('help');

        keys[39] = false;

      }

      if (element.type == 16) {
        // Teleporter
        map[row][column] = 0;
        king.hasTeleporter = true;
        king.weapon = 'teleporter';
        king.teleporters = king.teleporters + 5;
        score.updateWeapon('teleporter', king.teleporters);
      }

      if (element.type == 17) {
        // Destroyer
        map[row][column] = 0;
        king.hasDestroyer = true;
        king.weapon = 'destroyer';
        king.destroyers = king.destroyers + 5;
        score.updateWeapon('destroyer', king.destroyers);
      }

      // Collision with an arrow
      if (element.type == 10 ) {
        map[row][column] = 0;
        king.weapon = 'bow';
        king.arrows = king.arrows + 10;
        score.updateWeapon('bow', king.arrows);
      }

      
      // Collision with an open door (Ends the level)
      if (element.type == 13) {
        that.levelFinish(collisionDirection);
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
          // Update this later
          if (enemies[i].sX == 0 && enemies[i].type == 'wizard') enemies[i].sX = 64;
          else if (enemies[i].sX == 0 && enemies[i].type == 'enemy3') enemies[i].sX = 64;
          else if (enemies[i].sX == 0 && enemies[i].type == 'flyer') enemies[i].sX = 32;
          else enemies[i].sX = 0;
        } else if (collisionDirection == 'b') {
          enemies[i].grounded = true;
          if (enemies[i].type == 23) {
            enemies[i].velY = -7;
          } else if (enemies[i].type == 24) {
            enemies[i].velY = -10;
          }
        }

        // console.log(collisionDirection);
        if (collisionDirection == null && (enemies[i].type == 23 || enemies[i].type == 24)) {
          enemies[i].grounded = false;
        }
      }
    }
  };

  this.checkElementBulletCollision = function(element, row, column) {

	  for (var i = 0; i < enemyBullets.length; i++) {
		  var collisionDirection = that.collisionCheck(enemyBullets[i], element);

		  if (collisionDirection == 'b') {
			  //if collision is from bottom of the bullet, it is grounded, so that it can be bounced
			  enemyBullets[i].grounded = true;
		  } else if (collisionDirection == 't' || collisionDirection == 'l' || collisionDirection == 'r') {
			  enemyBullets.splice(i, 1);
		  }
	  }
	  
    for (var i = 0; i < kingBullets.length; i++) {
      var collisionDirection = that.collisionCheck(kingBullets[i], element);

      if (collisionDirection == 'b') {
        //if collision is from bottom of the bullet, it is grounded, so that it can be bounced
    	  kingBullets[i].grounded = true;
        if (kingBullets[i].type == 'teleporter') {
          king.x = kingBullets[i].x;
          king.y = kingBullets[i].y - 32;
          king.draw();
          that.checkKingPos();
          that.updateKing();
          gameSound.play('teleport');
        } else if (kingBullets[i].type == 'destroyer') {
          if (element.type == 1 || element.type == 2 || element.type == 3 || element.type == 4) {
            map[row][column] = 0;
            gameSound.play('explosion');
          }
        }
        kingBullets.splice(i, 1);
      } else if (collisionDirection == 't' || collisionDirection == 'l' || collisionDirection == 'r') {
        if (kingBullets[i].type == 'teleporter') {
          king.x = kingBullets[i].x;
          king.y = kingBullets[i].y - 32;
          king.draw();
          that.updateKing();
          gameSound.play('teleport');
        } else if (kingBullets[i].type == 'destroyer') {
          if (element.type == 1 || element.type == 2 || element.type == 3 || element.type == 4) {
            map[row][column] = 0;
            gameSound.play('explosion');
          }
        }
        kingBullets.splice(i, 1);
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

        gameSound.play('powerUp');
        
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
          gameSound.play('killEnemy');
        } else if (collWithKing == 'r' || collWithKing == 'l' || collWithKing == 'b') {
          enemies[i].velX *= -1;

          if (king.type == 'big') {
            king.type = 'small';
            king.invulnerable = true;
            collWithKing = undefined;

            //sound when king powerDowns
            gameSound.play('powerDown');

            setTimeout(function() {
              king.invulnerable = false;
            }, 1000);
          } else if (king.type == 'fire') {
            king.type = 'big';
            king.invulnerable = true;

            collWithKing = undefined;

            //sound when king powerDowns
            gameSound.play('powerDown');

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
            gameSound.play('kingDie');

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
      for (var j = 0; j < kingBullets.length; j++) {
        if (enemies[i] && enemies[i].state != 'dead' && kingBullets[j].enemy != 1) {
          //check for collision only if enemies exist and is not dead
          var collWithBullet = that.collisionCheck(enemies[i], kingBullets[j]);
        }

        if (collWithBullet) {
        	kingBullets[j] = null;
        	kingBullets.splice(j, 1);

          enemies[i].hp -= 1;

          if (enemies[i].hp == 0) {
            enemies[i].state = 'dead';

            score.totalScore += 1000;
            score.updateTotalScore();

            //sound when enemy dies
            gameSound.play('killEnemy');
          }
        }
      }
    }
  };

  this.checkBulletAllyCollision = function() {
    for (var j = 0; j < enemyBullets.length; j++) {
      if (enemyBullets[j].enemy != 0) {
        var collWithBullet = that.collisionCheck(king, enemyBullets[j]);
      }

      if (collWithBullet) {
    	  enemyBullets[j] = null;
    	  enemyBullets.splice(j, 1);

        if (king.type == 'big') {
          king.type = 'small';
          king.invulnerable = true;
          collWithKing = undefined;

          //sound when king powerDowns
          gameSound.play('powerDown');

          setTimeout(function() {
            king.invulnerable = false;
          }, 1000);
        } else if (king.type == 'fire') {
          king.type = 'big';
          king.invulnerable = true;

          collWithKing = undefined;

          //sound when king powerDowns
          gameSound.play('powerDown');

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
          gameSound.play('kingDie');

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
      gameSound.play('kingDie');

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
        gameSound.play('jump');
      }
    }

    if (keys[39]) {
      king.sX = 0;
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
      king.sX = 45;
      that.checkKingPos();
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

    // S key
    if (keys[83]) {
      gameSound.toggleAudio();
      for (var i = 0; i < keys.length; i++) {
          keys[i] = false;
      }
    }

    // W key
    // Handle weapon cycling
    if (keys[87]) {
      // Currently holding a sword
      if (king.weapon == 'sword') {
        if (king.hasBow) {
          king.weapon = 'bow';
          score.updateWeapon('bow', king.arrows);
        } else if (king.hasStaff) {
          king.weapon = 'staff';
          score.updateWeapon('staff', -1);
        } else if (king.hasTeleporter) {
          king.weapon = 'teleporter';
          score.updateWeapon('teleporter', king.teleporters);
        } else if (king.hasDestroyer) {
          king.weapon = 'destroyer';
          score.updateWeapon('destroyer', king.destroyers);
        }
        keys[87] = false;
        return;
      }

      // Currently holding a bow
      if (king.weapon == 'bow') {
        if (king.hasStaff) {
          king.weapon = 'staff';
          score.updateWeapon('staff', -1);
        } else if (king.hasTeleporter) {
          king.weapon = 'teleporter';
          score.updateWeapon('teleporter', king.teleporters);
        } else if (king.hasDestroyer) {
          king.weapon = 'destroyer';
          score.updateWeapon('destroyer', king.destroyers);
        } else if (king.hasSword) {
          king.weapon = 'sword';
          score.updateWeapon('sword', -1);
        }
        keys[87] = false;
        return;
      }

      // Currently holding a staff
      if (king.weapon == 'staff') {
        if (king.hasTeleporter) {
          king.weapon = 'teleporter';
          score.updateWeapon('teleporter', king.teleporters);
        } else if (king.hasDestroyer) {
          king.weapon = 'destroyer';
          score.updateWeapon('destroyer', king.destroyers);
        } else if (king.hasSword) {
          king.weapon = 'sword';
          score.updateWeapon('sword', -1);
        } else if (king.hasBow) {
          king.weapon = 'bow';
          score.updateWeapon('bow', king.arrows);
        }
        keys[87] = false;
        return;
      }

      // Currently holding a teleporter
      if (king.weapon == 'teleporter') {
        if (king.hasDestroyer) {
          king.weapon = 'destroyer';
          score.updateWeapon('destroyer', king.destroyers);
        } else if (king.hasSword) {
          king.weapon = 'sword';
          score.updateWeapon('sword', -1);
        } else if (king.hasBow) {
          king.weapon = 'bow';
          score.updateWeapon('bow', king.arrows);
        } else if (king.hasStaff) {
          king.weapon = 'staff';
          score.updateWeapon('staff', -1);
        }
        keys[87] = false;
        return;
      }

      // Currently holding a destroyer
      if (king.weapon == 'destroyer') {
        if (king.hasSword) {
          king.weapon = 'sword';
          score.updateWeapon('sword', -1);
        } else if (king.hasBow) {
          king.weapon = 'bow';
          score.updateWeapon('bow', king.arrows);
        } else if (king.hasStaff) {
          king.weapon = 'staff';
          score.updateWeapon('staff', -1);
        } else if (king.hasTeleporter) {
          king.weapon = 'teleporter';
          score.updateWeapon('teleporter', king.teleporters);
        }
        keys[87] = false;
        return;
      }
    }

    // When ctrl is pressed (attack key)
    if (keys[17] && (king.weapon == 'bow' || king.weapon == 'staff' || king.weapon == 'teleporter' || king.weapon == 'destroyer' || king.weapon == 'sword')) {
      // Only go inside if using a weapon
      //ctrl key
      if (!bulletFlag) {
        var bullet = new Bullet();

        if (king.velX >= 0) {
          var direction = 1;
        } else {
          var direction = -1;
        }

        if (king.weapon == 'teleporter' && king.teleporters > 0) {
          // Throwing a teleporter
          bulletFlag = true;
          bullet.changeType('teleporter');
          bullet.init(king.x, king.y, direction);
          kingBullets.push(bullet);
          king.teleporters = king.teleporters - 1;
          score.updateWeapon('teleporter', king.teleporters);
          gameSound.play('woosh');
          setTimeout(function() {
            bulletFlag = false; //only lets king fire bullet after 500ms
          }, 1000);
        } else if (king.weapon == 'destroyer' && king.destroyers > 0) {
          bulletFlag = true;
          bullet.changeType('destroyer');
          bullet.init(king.x, king.y, direction);
          kingBullets.push(bullet);
          king.destroyers = king.destroyers - 1;
          score.updateWeapon('destroyer', king.destroyers);
          gameSound.play('woosh');
          setTimeout(function() {
            bulletFlag = false; //only lets king fire bullet after 500ms
          }, 1000);
        } else if (king.weapon == 'bow' && king.arrows > 0) {
          bulletFlag = true;
          bullet.init(king.x, king.y, direction);
          bullet.changeType('arrow');
          kingBullets.push(bullet);
          king.arrows = king.arrows - 1;
          score.updateWeapon('bow', king.arrows);
          gameSound.play('bow');
          setTimeout(function() {
            bulletFlag = false; //only lets king fire bullet after 500ms
          }, 500);
        } else if (king.weapon == 'staff') {
          bulletFlag = true;
          bullet.changeType('fireball');
          bullet.init(king.x, king.y, direction);
          kingBullets.push(bullet);
          gameSound.play('fireball');
          setTimeout(function() {
            bulletFlag = false; //only lets king fire bullet after 500ms
          }, 1000);
        } else if (king.weapon == 'sword') {
          gameSound.play('sword');
          bulletFlag = true;
          if (king.velX >= 0) {
            bullet.changeType('swordRight');
          } else {
            bullet.changeType('swordLeft');
          }

          bullet.init(king.x, king.y, direction);
          kingBullets.push(bullet);
          gameSound.play('sword');
          var swordIndex = kingBullets.length;
          setTimeout(function() {
            //remove the sword "bullet" from the array after a quarter second
            for (var i = 0; i < kingBullets.length; i++) {
              if (kingBullets[i].type == 'swordRight' || kingBullets[i].type == 'swordLeft') {
            	  kingBullets.splice(i, 1);
              }
            }
            bulletFlag = false; //only lets king fire bullet after 500ms
          }, 250);
        }
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
    } else if (king.x <= centerPos - 3 && king.x > 640) {
      gameUI.scrollWindow(king.speed, 0);
      translatedDist -= king.speed;
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

    king.frame = 0;

    if (kingInGround) {
      king.x += 20;
      king.frame = 0;
      tickCounter += 1;
      if (tickCounter > maxTick) {
        that.pauseGame();

        king.x += 10;
        tickCounter = 0;
        king.frame = 0;

        // sound when stage clears
        gameSound.play('stageClear');
        if (originalMaps[2]== undefined) {
          window.location.reload();
        }

        timeOutId = setTimeout(function() {
          currentLevel++;
          if (originalMaps[currentLevel] && currentLevel < 6) {
            gameScreen.className = originalMaps[currentLevel+5];
            that.init(originalMaps, currentLevel,gameScreen);
            score.updateLevelNum(currentLevel);
          } else {
            that.gameOver();
          }
        }, 2000);
      }
    }
  };

  this.pauseGame = function() {
    window.cancelAnimationFrame(animationID);
  };

  this.gameOver = function() {
    // Play game over audio
    gameSound.play('gameOver');
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
    kingBullets = [];
    enemyBullets = [];
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
