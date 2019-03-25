function Element() {
  var gameUI = GameUI.getInstance();

  var element = new Image();
  element.src = 'images/elements.png';

  this.type;
  this.sX;
  this.sY = 0;
  this.x;
  this.y;
  this.width = 32;
  this.height = 32;

  var that = this;

  this.castlePlatform = function() {
    that.type = 1;
    that.sX = 0;
    element.src = 'images/elements.png';
  };

  this.forestPlatform = function() {
	element.src = 'images/elements.png';
    that.type = 2;
    that.sX = 1 * that.width;
  };

  this.cavePlatform = function() {
	element.src = 'images/elements.png';
    that.type = 3;
    that.sX = 2 * that.width;
  };

  this.lavaPlatform = function() {
	  element.src = 'images/elements.png';
    that.type = 4;
    that.sX = 3 * that.width;
  };

  this.chest = function() {
	  element.src = 'images/elements.png';
    that.type = 5;
    that.sX = 5 * that.width;
  };
  
  this.openChest = function() {
	  element.src = 'images/elements.png';
	    that.type = 6;
	    that.sX = 11 * that.width;
  };
  
  this.sword = function() {
	  element.src = 'images/elements.png';
	    that.type = 7;
	    that.sX = 6 * that.width;
  };
  
  this.bow = function() {
	  element.src = 'images/elements.png';
	    that.type = 8;
	    that.sX = 7 * that.width;
  };
  
  this.staff = function() {
	  element.src = 'images/elements.png';
	    that.type = 9;
	    that.sX = 8 * that.width;
  };
  
  this.arrow = function() {
	  element.src = 'images/elements.png';
	    that.type = 10;
	    that.sX = 9 * that.width;
  };
  
  this.key = function() {
	  element.src = 'images/elements.png';
	    that.type = 11;
	    that.sX = 10 * that.width;
  };
  
  this.door = function() {
	  element.src = 'images/elements.png';
	    that.type = 12;
	    that.sX = 11 * that.width;
  };
  
  this.openDoor = function() {
	  element.src = 'images/elements.png';
	    that.type = 13;
	    that.sX = 11 * that.width;
  };
  
  this.gem = function() {
	  element.src = 'images/gem.gif';
	    that.type = 14;
	    that.sX = 0;
  };


  this.draw = function() {
    gameUI.draw(element, that.sX, that.sY, that.width, that.height, that.x, that.y, that.width, that.height);
  };
}
