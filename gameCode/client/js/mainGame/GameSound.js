function GameSound() {
  var coin;
  var powerUpAppear;
  var powerUp;
  var kingDie;
  var killEnemy;
  var stageClear;
  var bullet;
  var powerDown;
  var jump;
  var mainMenuSound;
  var teleport;
  var bwahaha;
  var levelcomplete;
  var explosion;
  var muted;
  var campaignSound;
  var that = this;

  this.init = function() {
    muted = false;
    kingDie = new Audio('sounds/king-death.wav');
    bow = new Audio('sounds/bow.wav');
    jump = new Audio('sounds/jump.wav');
    bwahaha = new Audio('sounds/bwahaha.mp3');
    levelcomplete = new Audio('sounds/levelcomplete.mp3');

    gameOver = new Audio('sounds/gameOver.wav');
    fireball = new Audio('sounds/fireball.wav');
    mainMenuSound = new Audio('sounds/MainMenuSound.wav');
    teleport = new Audio('sounds/teleport.mp3');
    explosion = new Audio('sounds/bomb.wav');
    woosh = new Audio('sounds/throw.wav');
    sword = new Audio('sounds/sword.wav');
    campaignSound = new Audio('sounds/campaignSound.mp3');
  };

  this.play = function(element) {
    if (muted == false) {
      if (element == 'kingDie') {
        kingDie.pause();
        kingDie.currentTime = 0;
        kingDie.play();
      } else if (element == 'bow') {
        bow.pause();
        bow.currentTime = 0;
        bow.play();
      } else if (element == 'jump') {
        jump.pause();
        jump.currentTime = 0;
        jump.play();
      } else if (element == 'gameOver') {
        gameOver.pause();
        gameOver.currentTime = 0;
        gameOver.play();
      } else if (element == 'fireball') {
        gameOver.pause();
        gameOver.currentTime = 0;
        fireball.play();
      } else if (element == 'mainMenuSound') {
        mainMenuSound.pause();
        mainMenuSound.currentTime = 0;
        mainMenuSound.play();
      } else if (element == 'teleport') {
        teleport.pause();
        teleport.currentTime = 0;
        teleport.play();
      } else if (element == 'explosion') {
        explosion.pause();
        explosion.currentTime = 0;
        explosion.play();
      } else if (element == 'woosh') {
        woosh.pause();
        woosh.currentTime = 0;
        woosh.play();
      } else if (element == 'sword') {
        sword.pause();
        sword.currentTime = 0;
        sword.play();
      } else if (element == 'campaignSound') {
        campaignSound.play();
      } else if (element == 'bwahaha') {
        bwahaha.play();
      } else if (element == 'levelcomplete') {
        levelcomplete.play();
      }
    }
  };
  
  this.pause = function(element) {
	      if (element == 'kingDie') {
	        kingDie.pause();
	        kingDie.currentTime = 0;
	      } else if (element == 'bow') {
	        bow.pause();
	        bow.currentTime = 0;
	      } else if (element == 'jump') {
	        jump.pause();
	        jump.currentTime = 0;
	      } else if (element == 'gameOver') {
	        gameOver.pause();
	        gameOver.currentTime = 0;
	      } else if (element == 'fireball') {
	        gameOver.pause();
	        gameOver.currentTime = 0;
	      } else if (element == 'mainMenuSound') {
	        mainMenuSound.pause();
	        mainMenuSound.currentTime = 0;
	      } else if (element == 'teleport') {
	        teleport.pause();
	        teleport.currentTime = 0;
	      } else if (element == 'explosion') {
	        explosion.pause();
	        explosion.currentTime = 0;
	      } else if (element == 'woosh') {
	        woosh.pause();
	        woosh.currentTime = 0;
	      } else if (element == 'sword') {
	        sword.pause();
	        sword.currentTime = 0;
	      } else if (element == 'campaignSound') {
	    	  campaignSound.pause();
	    	  campaignSound.currentTime = 0;	      } 
	      else if (element == 'bwahaha') {
	    	  bwahaha.pause();
	    	  bwahaha.currentTime = 0;
	      } else if (element == 'levelcomplete') {
	    	  levelcomplete.pause();
	    	  levelcomplete.currentTime = 0;
	      }
	    
	  };

  this.toggleAudio = function() {
    if (muted == true) {
      alert('Audio unmuted.');
    } else {
      alert('Audio muted.');
    }
    muted = !muted;
  };
}
