function Preloader() {
  var view = View.getInstance();

  var loadingPercentage;

  var imageSources;
  var soundSources;

  var that = this;

  this.init = function() {
    loadingPercentage = view.create('div');

    view.addClass(loadingPercentage, 'loading-percentage');
    view.setHTML(loadingPercentage, '0%');
    view.appendToBody(loadingPercentage);

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
      18: 'images/bat2.png'
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

        view.setHTML(loadingPercentage, percentage + '%'); //displaying percentage

        if (loadedImages >= totalImages) {
          view.removeFromBody(loadingPercentage);
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
