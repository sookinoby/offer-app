(function(){
'use strict';
angular.module('selectStrategyGrid', ['selectStrategyGameData']).factory('TileModel', function() {
    var Tile = function(pos, val, answer) {
        this.x = pos.x;
        this.y = pos.y;
        this.value = val || 2;
        this.merged = null;
        this.selected = false;
        this.answer = answer;
        this.colorchange = false;
    };
    Tile.prototype.savePosition = function() {
        this.originalX = this.x;
        this.originalY = this.y;
    };
    Tile.prototype.flip = function() {
        this.selected = !this.selected;
    };
    Tile.prototype.setChangeColor = function() {
        this.default = false;
        this.changeColor = true;
    };
    Tile.prototype.resetChangeColor = function() {
        this.default = true;
        this.changeColor = false;
    };
    Tile.prototype.setSelected = function() {
        this.selected = true;
    };
    Tile.prototype.resetSelected = function() {
        this.selected = false;
    };
    Tile.prototype.reset = function() {
        this.merged = null;
    };
    Tile.prototype.setMergedBy = function(arr) {
        var self = this;
        arr.forEach(function(tile) {
            tile.merged = true;
            tile.updatePosition(self.getPosition());
        });
    };
    Tile.prototype.updateValue = function(newVal) {
        this.value = newVal;
    };
    Tile.prototype.updatePosition = function(newPosition) {
        this.x = newPosition.x;
        this.y = newPosition.y;
    };
    Tile.prototype.getPosition = function() {
        return {
            x: this.x,
            y: this.y
        };
    };
    return Tile;
}).service('SelectStrategyGridService', function(TileModel,$log) {
    this.linenumber = 0;
    this.factContent = null;

    this.instantaneousFeedBack = true;
    var service = this;

    this.size = 4; // Default size
    this.startingTiles = 12; // default starting tiles
    this.row = 3;
    this.column = 4;
    this.setSize = function(sz) {
        this.size = sz ? sz : 0;
    };
    //console.log(this);
    this.setStartingTiles = function(num) {
        this.startingTiles = num;
    };
    this.storeSelectedPositions = [];
    this.grid = [];
    this.tiles = [];
    this.gameData = [];
    this.nameOfStrategy = null;
    this.showSubmitButton = null;
    this.questionToDisplay = null;
    this.showNextButton = null;
    // Private things
    var vectors = {
        'left': {
            x: -1,
            y: 0
        },
        'right': {
            x: 1,
            y: 0
        },
        'up': {
            x: 0,
            y: -1
        },
        'down': {
            x: 0,
            y: 1
        }
    };
    this.buildDataForGame = function(gameData) {
        this.gameData = gameData;
        this.current_qn = 0;
    };
    // Build game board
    this.buildEmptyGameBoard = function() {
        var self = this;
        // Initialize our grid
        for (var x = 0; x < service.row * service.column; x++) {
            this.grid[x] = null;
        }
        this.forEach(function(x, y) {
            self.setCellAt({
                x: x,
                y: y
            }, null);
        });
    };
    /*
     * Prepare for traversal

    this.prepareTiles = function() {
      this.forEach(function(x,y,tile) {
        if (tile) {
          tile.savePosition();
          tile.reset();
        }
      });
    };


    this.cleanupCells = function() {
      var self = this;
      this.forEach(function(x, y, tile) {
        if (tile && tile.merged) {
          self.removeTile(tile);
        }
      });
    }; */
    this.setAnswerTile = function(tile) {
        this.correctAnswerTile.push(tile);
    };
    this.getAnswerTile = function() {
        return this.correctAnswerTile;
    };
    this.resetAnswerTile = function() {
        this.correctAnswerTile = [];
    };
    /*
     * Due to the fact we calculate the next positions
     * in order, we need to specify the order in which
     * we calculate the next positions

    this.traversalDirections = function(key) {
      var vector = vectors[key];
      var positions = {x: [], y: []};
      for (var x = 0; x < this.size; x++) {
        positions.x.push(x);
        positions.y.push(x);
      }

      if (vector.x > 0) {
        positions.x = positions.x.reverse();
      }
      if (vector.y > 0) {
        positions.y = positions.y.reverse();
      }

      return positions;
    };


    /*
     * Calculate the next position for a tile

    this.calculateNextPosition = function(cell, key) {
      var vector = vectors[key];
      var previous;

      do {
        previous = cell;
        cell = {
          x: previous.x + vector.x,
          y: previous.y + vector.y
        };
      } while (this.withinGrid(cell) && this.cellAvailable(cell));

      return {
        newPosition: previous,
        next: this.getCellAt(cell)
      };
    };


    this.cellAvailable = function(cell) {
      if (this.withinGrid(cell)) {
        return !this.getCellAt(cell);
      } else {
        return null;
      }
    };

     */
    this.indexOf = function(needle) {
    var indexOf;
    if (typeof Array.prototype.indexOf === 'function') {
      indexOf = Array.prototype.indexOf;
    } else {
      indexOf = function(needle) {
        var i = -1,
          index = -1;
        for (i = 0; i < this.length; i++) {
          if (this[i] === needle) {
            index = i;
            break;
          }
        }
        return index;
      };
    }
    return indexOf.call(this, needle);
  };
    this.withinGrid = function(cell) {
        return cell.x >= 0 && cell.x < this.column && cell.y >= 0 && cell.y < this.row;
    };
    this._getRandom = function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    this.resetFactContent = function() {
        this.linenumber = 0;
        this.factContent = [{
            'fact': '-',
            'select': false,
            'wrong': false,
            'right': false,
            'isAnswer': false
        }, {
            'fact': '-',
            'select': false,
            'wrong': false,
            'right': false,
            'isAnswer': false
        }, {
            'fact': '-',
            'select': false,
            'wrong': false,
            'right': false,
            'isAnswer': false
        }];
    };
    /*
     * Build the initial starting position
     * with randomly placed tiles
     */
    this.buildStartingPosition = function() {
        var gameData = this.gameData;
        // game data
       // hold the question
        var q = gameData.questionList[this.current_qn].Q[0];
        // hold the arraylist of answers
        var a = gameData.questionList[this.current_qn].A;
        // arraylist of options
        var optionsArrayList = gameData.questionList[ this.current_qn].O;
        // list of correctAnswer
        this.correctAnswerTile = [];
        // the slice function will create a copy of arraylist, so we wont destory arraylist
        //   var answersAndOptions = this.getOptions(a.slice(),optionsArrayList.slice());
        // console.log(makeOption);
        // inserts the question at random place
        // var tile =   this.randomlyInsertNewQuestionTile(q);
        this.questionToDisplay.question = q; // This will send the question to display to UI which is not part of Grid.
        // this.factContent = q + a;
        //var neighbhourCellsAvailable = this.findRelativeAvailableCells(tile);
        //this.insertTileAtAdjacentPosition(neighbhourCellsAvailable,answersAndOptions,a.length);
        this.insertTileInOrder(optionsArrayList, a);
        //    this.currentQuestionCells = tile;
        //    this.currentAnswersCells = neighbhourCellsAvailable;
        // console.log(neighbhourCellsAvailable);
    };
    this.deleteCurrentBoard = function() {
        this.storeSelectedPositions = [];
        this.showNextButton.truthValue = false;
        this.showSubmitButton.truthValue = false;
        for (var i = 0; i < this.row; i++) {
            for (var j = 0; j < this.column; j++) {
                this.removeTile({
                    x: j,
                    y: i
                });
            }
        }
        this.currentAnswersCells = [];
        this.currentQuestionCells = null;
        this.resetAnswerTile();
    };
    this.insertTileInOrder = function(optionsArrayList, a) {
        var avaiableNeighbhourCells = [];
        for (var i = 0; i < this.row; i++) {
            for (var j = 0; j < this.column; j++) {
                avaiableNeighbhourCells.push({
                    x: j,
                    y: i
                });
            }
        }
        var x = 0;
        var possibleOptions = [];
        for (x = 0; x < a.length; x++) {
          possibleOptions.push( {value:a[x], isAnswer:true});
        }
        for (x = 0; x < optionsArrayList.length; x++) {
          possibleOptions.push( {value:optionsArrayList[x], isAnswer:false});
        }
        possibleOptions = this.shuffle(possibleOptions);

        // console.log(optionsArrayList);
        //console.log(a);
      for (x = 0; x < possibleOptions.length; x++) {
            var cell = avaiableNeighbhourCells[x];
            var tile;
            if (possibleOptions[x].isAnswer === false) {
                // the last parameter is no used
                tile = this.newTile(cell, possibleOptions[x].value, false, false);
                // console.log("wrong" + optionsArrayList[x] );
            } else {
                // the last parameter is not used.
                tile = this.newTile(cell, possibleOptions[x].value, true, false);
                this.setAnswerTile(tile);
                //  console.log("right" + optionsArrayList[x] );
            }
            tile.resetChangeColor();
            tile.resetSelected();
            this.insertTile(tile);
        }
    };
    /*
     * Get all the available tiles
     */
    this.availableCells = function() {
        var cells = [],
            self = this;
        this.forEach(function(x, y) {
            var foundTile = self.getCellAt({
                x: x,
                y: y
            });
            if (!foundTile) {
                cells.push({
                    x: x,
                    y: y
                });
            }
        });
        return cells;
    };
    /*
    Shuffle
     */
    this.shuffle = function(o) { //v1.0
    for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x){}
    return o;
  };
    /*
     * Check to see if there are any matches available
     */
    this.tileMatchesAvailable = function() {
        var totalSize = service.size * service.size;
        for (var i = 0; i < totalSize; i++) {
            var pos = this._positionToCoordinates(i);
            var tile = this.tiles[i];
            if (tile) {
                // Check all vectors
                for (var vectorName in vectors) {
                    var vector = vectors[vectorName];
                    var cell = {
                        x: pos.x + vector.x,
                        y: pos.y + vector.y
                    };
                    var other = this.getCellAt(cell);
                    if (other && other.value === tile.value) {
                        return true;
                    }
                }
            }
        }
        return false;
    };
    /*
     * Get a cell at a position
     */
    this.getCellAt = function(pos) {
        if (this.withinGrid(pos)) {
            var x = this._coordinatesToPosition(pos);
            return this.tiles[x];
        } else {
            return null;
        }
    };
    /*
     * Set a cell at position
     */
    this.setCellAt = function(pos, tile) {
        if (this.withinGrid(pos)) {
            var xPos = this._coordinatesToPosition(pos);
            this.tiles[xPos] = tile;
        }
    };
    this.moveTile = function(tile, newPosition) {
        var oldPos = {
            x: tile.x,
            y: tile.y
        };
        this.setCellAt(oldPos, null);
        this.setCellAt(newPosition, tile);
        tile.updatePosition(newPosition);
    };
    /*
     * Run a callback for every cell
     * either on the grid or tiles
     */
    this.forEach = function(cb) {
        var totalSize = service.row * service.column;
        for (var i = 0; i < totalSize; i++) {
            var pos = this._positionToCoordinates(i);
            cb(pos.x, pos.y, this.tiles[i]);
        }
    };
    /*
     * Helper to convert x to x,y
     */
    this._positionToCoordinates = function(i) {
        var x = i % service.size,
            y = (i - x) / service.size;
        return {
            x: x,
            y: y
        };
    };
    /*
     * Helper to convert coordinates to position
     */
    this._coordinatesToPosition = function(pos) {
        return (pos.y * service.size) + pos.x;
    };
    /*
     * Insert a new tile
     */
    this.insertTile = function(tile) {
        var pos = this._coordinatesToPosition(tile);
        this.tiles[pos] = tile;
    };
    this.newTile = function(pos, value, isAnswer) {
        return new TileModel(pos, value, isAnswer);
    };
    /*
     * Remove a tile
     */
    this.removeTile = function(pos) {
        pos = this._coordinatesToPosition(pos);
        this.tiles[pos] = null;
        // delete this.tiles[pos];
    };
    /*
     * Same position
     */
    this.samePositions = function(a, b) {
        return a.x === b.x && a.y === b.y;
    };
    /*
     * Randomly insert a new tile
     */
    this.randomlyInsertNewTile = function() {
        var cell = this.randomAvailableCell(),
            tile = this.newTile(cell, 2);
        this.insertTile(tile);
    };
    /*
     * Get a randomly available cell from all the
     * currently available cells
     */
    this.randomAvailableCell = function() {
        var cells = this.availableCells();
        if (cells.length > 0) {
            return cells[Math.floor(Math.random() * cells.length)];
        }
    };
    /* to get the fact content */
    this.getFactContent = function() {
        return this.factContent;
    };
    this.setFactContent = function() {
        return this.factContent;
    };
    /* color change */
    this.factContentColorChange = function() {
        for (var i = 0; i < this.factContent.length; i++) {
            if (this.factContent[i].select === true) {
                if (this.factContent[i].isAnswer === true) {
                    this.factContent[i].right = true;
                } else {
                    this.factContent[i].wrong = true;
                }
            }
        }
    };
    /* store answer */
    this.clone = function(obj) {
        var copy;
        // Handle the 3 simple types, and null or undefined
        if (null === obj || "object" !== typeof obj) { return obj;}
        // Handle Date
        if (obj instanceof Date) {
            copy = new Date();
            copy.setTime(obj.getTime());
            return copy;
        }
        // Handle Array
        if (obj instanceof Array) {
            copy = [];
            for (var i = 0, len = obj.length; i < len; i++) {
                copy[i] = this.clone(obj[i]);
            }
            return copy;
        }
        // Handle Object
        if (obj instanceof Object) {
            copy = {};
            for (var attr in obj) {
                if (obj.hasOwnProperty(attr)) { copy[attr] = this.clone(obj[attr]);}
            }
            return copy;
        }
        throw new Error("Unable to copy obj! Its type isn't supported.");
    };
    this.storeAnswer = function(tileDetail) {
        // the submit button was already pressed
        if (service.showNextButton.truthValue) {
            return;
        }
        var c_x, c_y;
        c_x = tileDetail.x;
        c_y = tileDetail.y;
        var location = service._coordinatesToPosition({
            x: c_x,
            y: c_y
        });
        var index = service.storeSelectedPositions.indexOf(location);
        // the new answer selected was not found the list of selected, so the index is -1
         var tile;
          if (index === -1) {
            if (service.linenumber === 3) {return;}
            tileDetail.flip();
            service.storeSelectedPositions.push(service._coordinatesToPosition({
                x: c_x,
                y: c_y
            }));
            tile = service.getCellAt({
                x: c_x,
                y: c_y
            });
            service.factContent[service.linenumber].fact = tile.value;
            service.factContent[service.linenumber].select = true;
            service.factContent[service.linenumber].isAnswer = tile.answer;
            //  console.log(this.factContent);
            service.linenumber++;
            //   console.log(service.factContent);
        } else {
            service.storeSelectedPositions.splice(index, 1);
            tileDetail.flip();
            tile = service.getCellAt({
                x: c_x,
                y: c_y
            });
            var i;
            for ( i = 0; i < service.factContent.length; i++) {
                if (service.factContent[i].fact === tile.value) {
                    service.factContent[i].fact = "-";
                    service.factContent[i].select = false;
                    service.factContent[i].isAnswer = false;
                    service.linenumber--;
                }
            }
            var temp_factContent = service.clone(service.factContent);
            var k = 0;
            var length = service.factContent.length;
            for (i = 0; i < service.factContent.length; i++) {
                //  console.log(service.factContent[i].fact)
                if (service.factContent[i].fact !== "-") {
                    temp_factContent[k].fact = service.factContent[i].fact;
                    temp_factContent[k].select = service.factContent[i].select;
              //      $log.debug(temp_factContent[k].fact);
               //     $log.debug(temp_factContent[k].select);
                    k++;
                }
            }
            for (i = 0; i < k; i++) {
                service.factContent[i].fact = temp_factContent[i].fact;
                service.factContent[i].select = temp_factContent[i].select;
            }
            for (var j = k; j < length; j++) {
                service.factContent[j].fact = "-";
                service.factContent[j].select = false;
                service.factContent[j].isAnswer = false;
            }
        }
        if (service.storeSelectedPositions.length !== 0) {service.showSubmitButton.truthValue = true;}
        else {service.showSubmitButton.truthValue = false;}
        // console.log(service.storeSelectedPositions);
    };
    /* evaluate the selected answers */
    this.evaluateAnswer = function() {
        var isAnswerCorrect = true;
        var points_for_questions = 0;
        for (var i = 0; i < this.storeSelectedPositions.length; i++) {
            // console.log(this.storeSelectedPositions);
            var vector = this._positionToCoordinates(this.storeSelectedPositions[i]);
            var guessed_answer = this.getCellAt({
                x: vector.x,
                y: vector.y
            });

            if (guessed_answer === null) {
                continue;
            }
            var result = guessed_answer.answer;

            if (result === false) {
                guessed_answer.setChangeColor();
                var right_answers = this.getAnswerTile();
                for (var j = 0; j < right_answers.length; j++) {
                    var right_answer = right_answers[j];
                    guessed_answer.resetSelected();
                    right_answer.setChangeColor();
                }
                isAnswerCorrect = false;
            } else if (result) {
                points_for_questions = points_for_questions + 1;
                // console.log("correct answer");
                guessed_answer.resetSelected();
                guessed_answer.setChangeColor();
                this.incrementQuestionCounter();
            }
        }
        $log.debug(points_for_questions);
        this.factContentColorChange();
        if(isAnswerCorrect === true){
                return points_for_questions;
        }
        else {
            $log.debug("returning zero");
            return 0;
        }
    };

  this.incrementQuestionCounter = function()
  {
      if(this.current_qn ===  (this.gameData.questionList.length - 1))
      {
        this.current_qn = 0;

      }
      else {
        this.current_qn = this.current_qn  + 1;
      }
  };

    this.toShowSubmitButton = function(submit) {
        this.showSubmitButton = submit;
    };
    this.toShowQuestion = function(question) {
        this.questionToDisplay = question;
    };
    this.toShowNextButton = function(nextButton) {
        this.showNextButton = nextButton;
    };
    this.isAnswerSelected = function() {
        return this.storeSelectedPositions.length !== 0;
    };

    this.setInstantaneousFeedBack = function (value)
    {
    this.instantaneousFeedBack = value;
    };
    /*
     * Check to see there are still cells available
     */
    this.anyCellsAvailable = function() {
        return this.availableCells().length > 0;
    };
    return this;
});
})();
