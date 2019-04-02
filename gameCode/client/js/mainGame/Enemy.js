function Enemy() {
  var gameUI = GameUI.getInstance();

  var tickCounter = 0; //for animating enemy
  var maxTick = 10; //max number for ticks to show enemy sprite

  var element = new Image();
  element.src = 'images/enemy.png';

  this.x;
  this.y;
  this.velX = 1;
  this.velY = 0;
  this.grounded = false;
  this.type;
  this.state;
  this.fireRate;
  this.rangedAttack;
  this.bulletFlag = false;
  this.initialX;
  this.initialY;
  this.hp = 1;

  this.sX = 0;
  this.sY = 0;
  this.width = 64;
  this.height = 64;

  this.frame = 0;

  var that = this;

  this.wizard = function() {
    this.type = 20;
    this.fireRate = 2000;
    this.rangedAttack = true;
  };

  this.flyer = function() {
    this.type = 21;
    element.src = 'images/bat2.png';
    this.width = 32;
    this.height = 32;
    this.velY = 0;
  };

  this.enemy3 = function() {
    this.type = 22;
    element.src = 'images/enemy3.png';
    this.width = 64;
    this.height = 64;
    this.velY = 1;
    this.velX = 1;
    this.hp = 2;
  };

  this.crab = function() {
    this.type = 23;
    element.src = 'images/crab.png';
    this.width = 128;
    this.height = 128;
    this.fireRate = 500;
    this.rangedAttack = true;
    this.velX = 0;
    this.hp = 5;
  };

  this.boss = function() {
    this.type = 24;
    element.src = 'images/boss.png';
    this.width = 128;
    this.height = 128;
    this.fireRate = 1500;
    this.rangedAttack = true;
    this.hp = 5;
  };

  this.draw = function() {
    gameUI.draw(element, that.sX, that.sY, that.width, that.height, that.x, that.y, that.width, that.height);
  };

  this.update = function() {
    var gravity = 0.2;

    if (that.grounded && that.type != 23 && that.type != 24) {
      that.velY = 0;
    } else if (that.grounded && that.type == 23 && that.type == 24) {
      that.velY = -5;
    }

    if (that.state == 'dead') {
      //falling enemy
      that.frame = 0;
      that.velY += gravity;
      if (that.type != 23) {
        that.y += that.velY;
      } else {
        that.y -= that.velY;
      }
    } else {
      //only animate when not dead
      if (that.type == 21) {
        if (that.x > that.initialX + 50) {
          that.velX = -1;
        } else if (that.x < that.initialX - 50) {
          that.velX = 1;
        }
        that.velY = 0;
        //   if (that.y > that.initialY + 50 || that.y > that.initialY) {
        //       that.velY = -1;
        //   }
        //   else if (that.y < that.initialY - 50 || that.y < that.initialY) {
        //       that.velY = 1;
        //   }

        that.x += that.velX;
        that.y += that.velY;
      } else if (that.type == 23) {
        that.velY += gravity;
        that.x += that.velX;
        that.y += that.velY;
      } else if (that.type == 24) {
        that.velY += 0.4;
        if (that.x > that.initialX + 100) {
          that.velX = -3;
        } else if (that.x < that.initialX - 100) {
          that.velX = 3;
        }
        that.x += that.velX;
        that.y += that.velY;
      } else {
        that.velY += gravity;
        that.x += that.velX;
        that.y += that.velY;
      }

      //for animating
      tickCounter += 1;

      if (tickCounter > maxTick) {
        tickCounter = 0;
        if (that.frame == 0) {
          that.frame = 0;
        } else {
          that.frame = 0;
        }
      }
    }
  };
}
