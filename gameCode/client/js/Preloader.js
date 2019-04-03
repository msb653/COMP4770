function Preloader() {
  var view = View.getInstance();

  var imageSources;
  var soundSources;

  var that = this;

  this.init = function() {

    imageSources = {
      1: 'images/bg.png',
      2: 'images/arrow.png',
      3: 'images/gem.gif',
      4: 'images/elements.png',
      5: 'images/enemy.png',
      6: 'images/start-screen.png',
      7: 'images/grid.png',
      8: 'images/king-head.png',
      9: 'images/knight.png',
      10: 'images/powerups.png',
      11: 'images/slider-left.png',
      12: 'images/slider-right.png',
      13: 'images/openChest.png',
      14: 'images/door.png',
      15: 'images/elements.png',
      16: 'images/teleporter3.png',
      17: 'images/bomb.png',
      18: 'images/bat2.png',
      19: 'images/bow_icon.png',
      20: 'images/staff_icon.png',
      21: 'images/sword_icon.png',
      22: 'images/teleport_icon.png',
      23: 'images/no_weapon_icon.png',
      24: 'images/arrowLeft.png',
      25: 'images/swordLeft.png',
      26: 'images/enemy3.png',
      27: 'images/crab.png',
      28: 'images/boss.png',
      29: 'images/waterBall.png',
      30: 'images/greenFire.png'
    };

    that.loadImages(imageSources);
  };

  this.loadImages = function(imageSources) {
    var images = {};
    var loadedImages = 0;
    var totalImages = 0;

    for (var key in imageSources) {
      totalImages++;
    }

    for (var key in imageSources) {
      images[key] = new Image();
      images[key].src = imageSources[key];

      images[key].onload = function() {
        loadedImages++;
        percentage = Math.floor((loadedImages * 100) / totalImages);


        if (loadedImages >= totalImages) {
          that.initMainApp();
        }
      };
    }
  };

  this.initMainApp = function() {
    var kingMakerInstance = KingMaker.getInstance();
    kingMakerInstance.init();
  };
}

window.onload = function() {
  var preloader = new Preloader();
  preloader.init();
};
