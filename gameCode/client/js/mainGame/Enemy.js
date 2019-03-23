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

  this.sX;
  this.sY = 0;
  this.width = 64;
  this.height = 64;

  this.frame = 0;

  var that = this;

  this.wizard = function() {
    this.type = 20;
    that.sX = 0;
    this.fireRate = 2000;
    this.rangedAttack = true;
  };
  

  this.draw = function() {
    that.sX = that.width * that.frame;
    gameUI.draw(element, that.sX, that.sY, that.width, that.height, that.x, that.y, that.width, that.height);
  };
  


  this.update = function() {
    var gravity = 0.2;

    if (that.grounded) {
      that.velY = 0;
    }

    if (that.state == 'dead') {
      //falling enemy
      that.frame = 0;
      that.velY += gravity;
      that.y += that.velY;
    } else {
      //only animate when not dead
      that.velY += gravity;
      that.x += that.velX;
      that.y += that.velY;

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
