function King() {
  var gameUI = GameUI.getInstance();

  this.type = 'normal';
  this.x;
  this.y;
  this.width = 45;
  this.height = 64;
  this.speed = 3;
  this.velX = 0;
  this.velY = 0;
  this.jumping = false;
  this.grounded = false;
  this.invulnerable = false;
  this.sX = 0; // sprite x
  this.sY = 4; // sprite y
  this.frame = 0;
  this.hasSword;
  this.hasBow;
  this.hasStaff;
  this.hasTeleporter;
  this.hasDestroyer;
  this.arrows;
  this.destroyers;
  this.teleporters;
  this.weapon;

  var that = this;

  this.init = function(x, y, checkpoint) {
    if(checkpoint){
        that.x = x*32+32;
        that.y = y*32;
        console.log("x="+that.x+" y="+that.y);
    }else{
        that.x = 10;
    that.y = gameUI.getHeight() - 40 - 40;
    }
    
    kingSprite = new Image();
    kingSprite.src = 'images/knight.png';
    this.hasSword = false;
    this.hasBow = false;
    this.hasStaff = false;
    this.hasTeleporter = false;
    this.hasDestroyer = false;
    this.arrows = 0;
    this.teleporters = 0;
    this.destroyers = 0;
    this.weapon = 'none';
  };

  this.draw = function() {
	  if (that.type == 'golden') {
		  gameUI.draw(kingSprite, that.sX, that.sY+64, that.width, that.height, that.x, that.y, that.width, that.height);
	  } else {
		  gameUI.draw(kingSprite, that.sX, that.sY, that.width, that.height, that.x, that.y, that.width, that.height);
 
	  }
  };

  

  this.resetPos = function() {
    that.x = canvas.width / 10;
    that.y = canvas.height - 40;
    that.frame = 0;
  };
}
