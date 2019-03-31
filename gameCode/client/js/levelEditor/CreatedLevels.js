function CreatedLevels() {
  var view = View.getInstance();

  var socket = io();

  var storage;
  var levelsWrapper;
  var levels;

  var that = this;

  this.init = function() {
    socket.emit('requestLevels', {
      user: sessionStorage.getItem('username')
    });

    socket.on('levelsResponse', function(data) {
      if (data.success) {
        levels = data.levels;
        that.loadLevelList();
      } else alert('Request unsuccessful.');
    });

    var mainWrapper = view.getMainWrapper();
    var deleteAllBtn = view.create('button');
    deleteAllBtn.innerHTML = 'Delete Levels';
    levelsWrapper = view.create('div');

    view.addClass(levelsWrapper, 'levels-wrapper');
    view.style(levelsWrapper, { display: 'block' });
    view.append(levelsWrapper, deleteAllBtn);
    view.append(mainWrapper, levelsWrapper);

    deleteAllBtn.onclick = that.deleteAllMaps;

    storage = new Storage();
  };

   var levelPlay = view.create('button');
   levelPlay.onclick = function(){
       that.startLevel(levelSelect.selectedIndex);
       that.removeCreatedLevelsScreen();
   };
    var levelSelect = view.create('select');    


  this.loadLevelList = function() {
    var testDiv = view.create('div');
    view.append(testDiv, levelPlay);
    let totalStoredLevels = levels.length;
    view.setHTML(levelPlay,"Play");
    if (totalStoredLevels != 0) {
      for (var i = 0; i < totalStoredLevels; i++) {
        var levelButton = view.create('option');
        view.append(levelSelect, levelButton);
        var levelName = levels[i].name;
        view.setHTML(levelButton, levelName);
        
        // (function(i) {
        //   levelSelect.onselect = (function(i) {
        //     return function() {
        //       levelIndex = i;
        //     };
        //   })(i);
        // })(i);
      }
      view.append(testDiv, levelSelect);
      view.append(levelsWrapper, testDiv);
    } else {
      var noMapsMessage = view.create('div');

      view.addClass(noMapsMessage, 'no-maps');
      view.setHTML(noMapsMessage, 'No levels found. Created levels will be listed here.');
      view.append(levelsWrapper, noMapsMessage);
    }
  };

  this.deleteAllMaps = function() {
    storage.clear();
    socket.emit('deleteLevel', {
      user: sessionStorage.getItem('username'),
      name: sessionStorage.getItem('name')
    });
    that.removeCreatedLevelsScreen();
    that.init();
  };

  socket.on('deleteLevelResponse', function(data) {
    if (data.success) {
      alert('Save successful.');
    } else alert('Save unsuccessful.');
  });

  this.startLevel = function(i) {
    var level = levels[i];

    var kingMakerInstance = KingMaker.getInstance();
    var levelName = level.name;
    var loadMap = level.tileArray;
    var map = { 1: loadMap }; //always only one level in saved maps.

    kingMakerInstance.startGame(map);
  };

  this.showCreatedLevelsScreen = function() {
    if (levelsWrapper) {
      view.style(levelsWrapper, { display: 'block' });
    }
  };

  this.removeCreatedLevelsScreen = function() {
    if (levelsWrapper) {
      view.style(levelsWrapper, { display: 'none' });

      while (levelsWrapper.hasChildNodes()) {
        //removes all the created levels on screen, so that it can be initiated again showing new levels that user creates
        view.remove(levelsWrapper, levelsWrapper.lastChild);
      }
    }
  };
}
