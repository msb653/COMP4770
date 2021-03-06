function Score() {
  var view = View.getInstance();

  var mainWrapper;
  var scoreWrapper;
  var coinScoreWrapper;
  var totalScoreWrapper;
  var lifeCountWrapper;
  var weaponWrapper;
  var tempWrapper;
  var chestWrapper;
  var timeElapsedWrapper;
  var totalSeconds = 0;
  this.coinScore;
  this.totalScore;
  this.lifeCount;
  this.timeElapsed;

  // var hour;
  // var minute;
  // var seconds;
  var s;
  var that = this;

  this.init = function() {
    that.coinScore = 0;
    that.totalScore = 0;
    that.lifeCount = 5;
    that.timeElapsed = 0;

    mainWrapper = view.getMainWrapper();

    scoreWrapper = view.create('div');
    coinScoreWrapper = view.create('div');
    totalScoreWrapper = view.create('div');
    lifeCountWrapper = view.create('div');
    weaponWrapper = view.create('div');
    tempWrapper = view.create('div');
    chestWrapper = view.create('div');
    timeElapsedWrapper = view.create('div');

    s = document.getElementById('timeElapsedWrapper');
    view.addClass(scoreWrapper, 'score-wrapper');
    view.addClass(coinScoreWrapper, 'gem-score');
    view.addClass(tempWrapper, 'door-face');
    view.addClass(chestWrapper, 'chest-face');
    view.addClass(totalScoreWrapper, 'total-score');
    view.addClass(lifeCountWrapper, 'life-count');
    view.addClass(weaponWrapper, 'no-weapon-icon');
    view.addClass(timeElapsedWrapper, 'total-timeElapsed');

    view.append(scoreWrapper, weaponWrapper);
    view.append(scoreWrapper, lifeCountWrapper);
    view.append(scoreWrapper, coinScoreWrapper);
    view.append(scoreWrapper, totalScoreWrapper);
    view.append(scoreWrapper, tempWrapper);
    view.append(scoreWrapper, chestWrapper);
    view.append(scoreWrapper, timeElapsedWrapper);
    view.append(mainWrapper, scoreWrapper);

    that.updateCoinScore();
    that.updateTotalScore();
    that.updateLifeCount();
    that.updateTimeElapsed();
    that.updateWeapon('none', -1);
  };

  function add() {
    totalSeconds++;
    var hour = Math.floor(totalSeconds / 3600);
    var minute = Math.floor((totalSeconds - hour * 3600) / 60);
    var seconds = totalSeconds - (hour * 3600 + minute * 60);
    timer();
    view.setHTML(timeElapsedWrapper, 'Timer: ' + hour + 'h :' + minute + 'm :' + seconds + 's');
  }

  function timer() {
    t = setTimeout(add, 1000);
  }

  this.updateCoinScore = function() {
    if (that.coinScore == 100) {
      that.coinScore = 0;
      that.lifeCount++;
      that.updateLifeCount();
    }

    view.setHTML(coinScoreWrapper, 'Gems: ' + that.coinScore);
  };

  this.updateTotalScore = function() {
    view.setHTML(totalScoreWrapper, 'Score: ' + that.totalScore);
  };

  this.updateTimeElapsed = function() {
    that.timeElapsed = timer();
    // view.setHTML(timeElapsedWrapper, 'Time Elapsed: ' + that.timeElapsed);
  };

  this.updateLifeCount = function() {
    view.setHTML(lifeCountWrapper, 'x ' + that.lifeCount);
  };

  this.updateWeapon = function(weapon, ammo) {
    // Set the ammo value
    if (ammo >= 0) {
      view.setHTML(weaponWrapper, 'Ammo: ' + ammo); // Weapon with limited ammo
    } else {
      view.setHTML(weaponWrapper, 'Ammo: ' + '∞'); // Weapon with infinite ammo
    }

    // Update weapon icon
    if (weapon == 'sword') view.addClass(weaponWrapper, 'sword-icon');
    else if (weapon == 'bow') view.addClass(weaponWrapper, 'bow-icon');
    else if (weapon == 'staff') view.addClass(weaponWrapper, 'staff-icon');
    else if (weapon == 'teleporter') view.addClass(weaponWrapper, 'teleporter-icon');
    else if (weapon == 'destroyer') view.addClass(weaponWrapper, 'destroyer-icon');
    else if (weapon == 'none') view.addClass(weaponWrapper, 'no-weapon-icon');
  };

  this.displayScore = function() {
    view.style(scoreWrapper, { display: 'block', background: 'black' });
  };

  this.hideScore = function() {
    view.style(scoreWrapper, { display: 'none' });

    that.coinScore = 0;
    that.lifeCount = 5;
    that.totalScore = 0;
    that.timeElapsed = 0;
    that.updateCoinScore();
    that.updateTotalScore();
    that.updateLifeCount();
    that.updateTimeElapsed();
  };

  this.gameOverView = function() {
    view.style(scoreWrapper, { background: 'black' });
  };
  
  this.resetTime = function() {
	    totalSeconds = 0;
};
this.getTotalSeconds = function() {
	    return totalSeconds;
};
}
