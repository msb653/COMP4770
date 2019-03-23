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

  var that = this;

  this.init = function() {
    coin = new Audio('sounds/coin.wav');
    powerUpAppear = new Audio('sounds/power-up-appear.wav');
    powerUp = new Audio('sounds/power-up.wav');
    kingDie = new Audio('sounds/king-death.wav');
    killEnemy = new Audio('sounds/kill-enemy.wav');
    stageClear = new Audio('sounds/stage-clear.wav');
    bullet = new Audio('sounds/bow.wav');
    powerDown = new Audio('sounds/power-down.wav');
    jump = new Audio('sounds/jump.wav');
    gameOver = new Audio('sounds/gameOver.wav');
    fireball = new Audio('sounds/fireball.wav');
  };

  this.play = function(element) {
    if (element == 'coin') {
      coin.pause();
      coin.currentTime = 0;
      coin.play();
    } else if (element == 'powerUpAppear') {
      powerUpAppear.pause();
      powerUpAppear.currentTime = 0;
      powerUpAppear.play();
    } else if (element == 'powerUp') {
      powerUp.pause();
      powerUp.currentTime = 0;
      powerUp.play();
    } else if (element == 'kingDie') {
      kingDie.pause();
      kingDie.currentTime = 0;
      kingDie.play();
    } else if (element == 'killEnemy') {
      killEnemy.pause();
      killEnemy.currentTime = 0;
      killEnemy.play();
    } else if (element == 'stageClear') {
      stageClear.pause();
      stageClear.currentTime = 0;
      stageClear.play();
    } else if (element == 'bullet') {
      bullet.pause();
      bullet.currentTime = 0;
      bullet.play();
    } else if (element == 'powerDown') {
      powerDown.pause();
      powerDown.currentTime = 0;
      powerDown.play();
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
        }
  };
}
