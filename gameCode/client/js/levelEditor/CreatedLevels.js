function CreatedLevels() {
	var view = View.getInstance();

	var socket = io();

	var storage;
	var levelsWrapper;
	var levels;

	var that = this;

	this.init = function() {
		socket.emit('requestLevels', {
			user: sessionStorage.getItem("username")
		});

		socket.on('levelsResponse', function (data) {
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

	this.loadLevelList = function() {

		let totalStoredLevels = levels.length;
		if (totalStoredLevels != 0) {
			for (var i = 1; i < totalStoredLevels; i++) {
				var testDiv = view.create('div');
				var levelButton = view.create('button');
				var levelName = levels[i].name;
				view.setHTML(levelButton, levelName);
				view.append(testDiv, levelButton);
				view.append(levelsWrapper, testDiv);

				levelButton.onclick = (function(i) {
					return function() {
						that.startLevel(i);
						that.removeCreatedLevelsScreen();
					};
				})(i);
			}
		} else {
			var noMapsMessage = view.create('div');

			view.addClass(noMapsMessage, 'no-maps');
			view.setHTML(noMapsMessage, 'No levels found. Created levels will be listed here.');
			view.append(levelsWrapper, noMapsMessage);
		}
	};

	this.deleteAllMaps = function() {
		storage.clear();

		that.removeCreatedLevelsScreen();
		that.init();
	};

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
