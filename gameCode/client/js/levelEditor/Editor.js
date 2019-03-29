//Main Class of Level Editor

function Editor() {
  var view = View.getInstance();
  var mainWrapper;

  
  var socket = io();
  
  var gameWorld;
  var viewPort;

  var grid;
  var elementwrapper;

  var map;
  var bgImage;
  var maxWidth;
  var height = 480;
  var tileSize = 32;
  var scrollMargin = 0;

  var selectedElement = [];

  var that = this;

  this.init = function() {
    mainWrapper = view.getMainWrapper();
    viewPort = view.create('div');

    view.addClass(viewPort, 'editor-screen');
    view.style(viewPort, { display: 'block' });
    

    that.createLevelEditor();
    that.drawGrid(3840); //draws grid of size 3840px by default at start
    that.showElements();
    view.append(mainWrapper, viewPort);
    bgImage = 'forest';
  };

  this.createLevelEditor = function() {
    var rightArrow = view.create('div');
    var leftArrow = view.create('div');
    gameWorld = view.create('div');

    view.style(gameWorld, { width: 6400 + 'px' });
    view.style(gameWorld, { height: height + 'px' });

    view.addClass(rightArrow, 'right-arrow');
    view.addClass(leftArrow, 'left-arrow');

    view.append(viewPort, rightArrow);
    view.append(viewPort, leftArrow);
    view.append(viewPort, gameWorld);

    rightArrow.addEventListener('click', that.rightScroll);
    leftArrow.addEventListener('click', that.leftScroll);
  };

  this.drawGrid = function(width) {
    maxWidth = width;
    grid = view.create('table');

    var row = height / tileSize;
    var column = maxWidth / tileSize;

    var mousedown = false;
    var selected = false;

    for (i = 1; i <= row; i++) {
      var tr = view.create('tr');
      for (j = 1; j <= column; j++) {
        var td = view.create('td');

        view.addClass(td, 'cell');

        td.addEventListener('mousedown', function(e) {
          e.preventDefault(); //to stop the mouse pointer to change
        });

        td.onmousedown = (function(i, j) {
          return function() {
            selectedElement.push(this);
            view.addClass(this, 'active');
            mousedown = true;
          };
        })(i, j);

        td.onmouseover = (function(i, j) {
          return function() {
            if (mousedown) {
              selectedElement.push(this);
              view.addClass(this, 'active');
            }
          };
        })(i, j);

        td.onmouseup = function() {
          mousedown = false;
        };

        view.append(tr, td);
      }

      view.append(grid, tr);

      grid.onmouseleave = function() {
        //if mouse hovers over the editor screen
        mousedown = false;
      };
    }

    view.append(gameWorld, grid);
  };

  this.showElements = function() {
    elementWrapper = view.create('div');

    view.addClass(elementWrapper, 'element-wrapper');
    view.append(mainWrapper, elementWrapper);

    var elements = [
      'cell',
      'platformCastle',
      'platformForest',
      'platformCave',
      'platformLava',
      'gem',
      'chest',
      'sword',
      'bow',
      'staff',
      'arrow',
      'key',
      'door',
      'enemy1',
      'dguy'
    ];
 
    var element;

    var saveMap = view.create('button');
    var clearMap = view.create('button');
    var lvlSize = view.create('div');
    var gridSmallBtn = view.create('button');
    var gridMediumBtn = view.create('button');
    var gridLargeBtn = view.create('button');
    var castleBtn = view.create('button');
    var forestBtn = view.create('button');
    var caveBtn = view.create('button');
    var lavaBtn = view.create('button');
    var nameField = view.create('input');
    nameField.id = 'levelName';
    castleBtn.innerHTML = 'Castle';
    forestBtn.innerHTML = 'Forest';
    caveBtn.innerHTML = 'Cave';
    lavaBtn.innerHTML = 'Lava';
    gridSmallBtn.innerHTML = 'Small';
    gridMediumBtn.innerHTML = 'Medium';
    gridLargeBtn.innerHTML = 'Large';
    saveMap.innerHTML = 'Save';
    clearMap.innerHTML = 'Clear Level';
    

    //for every element in the 'elements' array, it creates a div and sets the class name
    for (i = 0; i < elements.length; i++) {
      element = view.create('div');

      view.addClass(element, elements[i]);
      view.append(elementWrapper, element);

      element.onclick = (function(i) {
        return function() {
          that.drawElement(elements[i]);
        };
      })(i);
    }

    view.addClass(lvlSize, 'lvl-size');
    view.style(elementWrapper, { display: 'block' });
    view.append(elementWrapper, lvlSize);
    view.append(elementWrapper, gridSmallBtn);
    view.append(elementWrapper, gridMediumBtn);
    view.append(elementWrapper, gridLargeBtn);
    view.append(elementWrapper, castleBtn);
    view.append(elementWrapper, forestBtn);
    view.append(elementWrapper, caveBtn);
    view.append(elementWrapper, lavaBtn);
    view.append(elementWrapper, clearMap);
    view.append(elementWrapper, saveMap);
    view.append(elementWrapper, nameField)

    saveMap.addEventListener('click', that.saveMap);
    clearMap.addEventListener('click', that.resetEditor);
    gridSmallBtn.addEventListener('click', that.gridSmall);
    gridMediumBtn.addEventListener('click', that.gridMedium);
    gridLargeBtn.addEventListener('click', that.gridLarge);
    castleBtn.addEventListener('click', that.castleBackground);
    forestBtn.addEventListener('click', that.forestBackground);
    caveBtn.addEventListener('click', that.caveBackground);
    lavaBtn.addEventListener('click', that.lavaBackground);
  };

  that.gridSmall = function() {
    view.remove(gameWorld, grid);
    that.drawGrid(1280); //small grid size
  };

  that.gridMedium = function() {
    view.remove(gameWorld, grid);
    that.drawGrid(3840); //medium grid size
  };

  that.gridLarge = function() {
    view.remove(gameWorld, grid);
    that.drawGrid(6400); //large grid size
  };
  that.castleBackground = function() {
	  bgImage = 'castle';
	  view.addClass(viewPort, 'castle');
  };
  that.forestBackground = function() {
	  bgImage = 'forest';
	  view.addClass(viewPort, 'forest');
  };
  that.caveBackground = function() {
	  bgImage = 'cave';
	  view.addClass(viewPort, 'cave');
  };
  that.lavaBackground = function() {
	  bgImage = 'lava';
	  view.addClass(viewPort, 'lava');
  };

  this.drawElement = function(element) {
    /*
      every element that is selected is pushed into 'selectedElement' array
      after clicking the required element, it loops through the array and sets the class name 
      of that cell, changing the background of the cell.
    */

    for (var i = 0; i < selectedElement.length; i++) {
      view.addClass(selectedElement[i], element);
    }

    selectedElement = [];
  };

  that.generateMap = function() {
    var newMap = [];
    var gridRows = grid.getElementsByTagName('tr');

    //loops through the table cells and checks for the class-name, puts the value according to its className;
    for (var i = 0; i < gridRows.length; i++) {
      var columns = [];
      var gridColumns = gridRows[i].getElementsByTagName('td');
      for (var j = 0; j < gridColumns.length; j++) {
        var value;

        switch (gridColumns[j].className) {
          case 'platformCastle':
            value = 1;
            break;

          case 'platformForest':
            value = 2;
            break;

          case 'platformCave':
            value = 3;
            break;

          case 'platformLava':
            value = 4;
            break;
            
          case 'chest':
              value = 5;
              break;
              
          case 'sword':
              value = 7;
              break;
              
          case 'bow':
              value = 8;
              break;
              
          case 'staff':
              value = 9;
              break;
              
          case 'arrow':
              value = 10;
              break;
              
          case 'key':
              value = 11;
              break;
              
          case 'door':
              value = 12;
              break;
              
          case 'gem':
              value = 14;
              break;

          case 'dguy':
              value = 15;
              break;
          case 'enemy1':
            value = 20;
            break;


          default:
            value = 0;
            break;
        }
        columns.push(value);
      }
      newMap.push(columns);
    }
    map = newMap;
  };

  
  this.saveMap = function () {
	  that.generateMap();
      socket.emit('saveLevel', {
          user: sessionStorage.getItem("username"),
          name: document.getElementById("levelName").value,
          tileArray:  JSON.stringify(map),
          backgroundImage: bgImage
      });
  };
  socket.on('saveLevelResponse', function (data) {
      if (data.success) {
          alert('Save successful.');
      } else alert('Save unsuccessful.');
  });

  this.rightScroll = function() {
    if (scrollMargin > -(maxWidth - 1280)) {
      scrollMargin += -160;
      view.style(gameWorld, { 'margin-left': scrollMargin + 'px' });
    }
  };

  this.leftScroll = function() {
    if (scrollMargin != 0) {
      scrollMargin += 160;
      view.style(gameWorld, { 'margin-left': scrollMargin + 'px' });
    }
  };

  this.resetEditor = function() {
    var gridRows = grid.getElementsByTagName('tr');
    for (var i = 0; i < gridRows.length; i++) {
      var gridColumns = gridRows[i].getElementsByTagName('td');

      for (var j = 0; j < gridColumns.length; j++) {
        view.addClass(gridColumns[j], 'cell');
      }
    }

    selectedElement = [];
    scrollMargin = 0;
    view.style(gameWorld, { 'margin-left': scrollMargin + 'px' });
  };

  this.removeEditorScreen = function() {
    if (viewPort) {
      that.resetEditor();
      view.style(viewPort, { display: 'none' });
      view.style(elementWrapper, { display: 'none' });
    }
  };

  this.showEditorScreen = function() {
    if (viewPort) {
      view.style(viewPort, { display: 'block' });
      view.style(elementWrapper, { display: 'block' });
    }
  };
}
