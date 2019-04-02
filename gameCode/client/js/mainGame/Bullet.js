function Bullet() {
  var gameUI = GameUI.getInstance();

  var element = new Image();
  element.src = 'images/arrow.png';

  this.x;
  this.y;
  this.velX;
  this.velY;
  this.grounded = false;
  this.sX;
  this.sY = 0;
  this.width = 32;
  this.height = 32;
  this.enemy = 0;
  this.type;

  var that = this;

  this.init = function(x, y, direction) {
    that.velX = 8 * direction; //changing the direction of the bullet if the king faces another side
    that.velY = 0;
    that.x = x + that.width;
    that.y = y + 30;
    if (that.type == 'swordRight') {
    	that.y = y+15;
    	that.x = x + that.width;
    }
    if (that.type == 'swordLeft') {
    	that.y = y+15;
    	that.x = x - 20;
    }
    that.sX = 0;
  };

  this.draw = function() {
    gameUI.draw(element, that.sX, that.sY, that.width, that.height, that.x, that.y, that.width, that.height);
  };

  this.update = function() {
    var gravity = 0.2;

    if (that.grounded && that.type != "teleporter") {
      //bouncing the bullet as it touches the ground
      that.grounded = false;
    }

    that.velY += gravity;

     
      if (that.type == "teleporter") {
          that.y += that.velY - 7;
          that.x += that.velX * 0.5;
      }
      else if(that.type == "destroyer") {
          that.y += that.velY - 10;
          that.x += that.velX*0.75;
      }
      else if(that.type == "sword") {
    	  // Update is based on the kings position (handled in kingGame.js)
      }
      else {
          that.x += that.velX;
      }
  };
  
  this.changeType = function(type) {
	  if (type == "fireball") {
		  element.src = 'images/bullet.png';
		  this.type='fireball';
      }
	  if (type == "waterball") {
		  element.src = 'images/waterball.png';
		  this.type='waterball';
      }
      if (type == "teleporter") {
		  element.src = 'images/teleporter3.png';
		  this.type='teleporter';
      }
      if (type == "destroyer") {
		  element.src = 'images/bomb.png';
		  this.type='destroyer';
	  }
      if (type == "arrow") {
    	  if (this.velX >= 0)
    		  element.src = 'images/arrow.png';
    	  else
    		  element.src = 'images/arrowLeft.png';
		  this.type='arrow';
	  }
      if (type == "swordRight") {
    	  element.src = 'images/sword_icon.png';
		  this.type='swordRight';
	  }
      if (type == "swordLeft") {
    	  element.src = 'images/swordLeft.png';
		  this.type='swordLeft';
	  }
  }
}
