(function(){
'use strict';
angular.module('threeDigitGrid', ['threeDigitGameData']).factory('TileModelThreeDigit', function() {
    var Tile = function(pos, val, answer,numberAnswer) {
        this.x = pos.x;
        this.y = pos.y;
        this.value = val || "";
       // this.id = GenerateUniqueId.next();
        this.merged = null;
        this.selected = false;
        this.answer = answer;
        this.numberAnswer = numberAnswer;
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

    Tile.prototype.setAnswer = function(answer) {
        this.answer = answer;
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
}).service('threeDigitGridService', function(TileModelThreeDigit, threeDigitGameDataService) {
    var promise = threeDigitGameDataService.getGameData("4");
    this.dataFromFile = null;
    this.linenumber = 0;
    this.watchListLineNumber = 0;
    this.factContent;
    this.watchListContent;
    this.questionContent;
    var service = this;
    promise.then(function(data) {
        service.dataFromFile = data.data.GameData;
        //  console.log(service.dataFromFile);          
    });
    this.size = 3; // Default size
    this.startingTiles = 9; // default starting tiles
    this.row = 3;
    this.column = 3;
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
    this.statergy_to_select = null;
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
    this.buildDataForGame = function(gameData, nameOfStrategy) {
        this.gameData = gameData;
        this.nameOfStrategy = nameOfStrategy;
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
    }
    this.getAnswerTile = function() {
        return this.correctAnswerTile;
    }
    this.resetAnswerTile = function(tile) {
        this.correctAnswerTile = [];
    }
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


    this.resetWatchList = function() {
        this.watchListLineNumber = 0;
        this.watchListContent = [{
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
        }, {
            'fact': '-',
            'select': false,
            'wrong': false,
            'right': false,
            'isAnswer': false
        }
        ];
    };

    this.resetQuestionContent = function() {

        this.questionContent = [{
            'question': "",
            'symbol': "",
            'answer': "",
            'wrong' : false
        }, {
            'question': "-",
            'symbol': "",
            'answer': "",
            'wrong' : false
        }, {
            'question': "-",
            'symbol': "",
            'answer': "",
            'wrong' : false
        }];
    }

    /*
     * Build the initial starting position
     * with randomly placed tiles
     */
    this.buildStartingPosition = function() {
        var sname = this.nameOfStrategy;
        var statergy_to_select = null;
        this.resetQuestionContent();
        this.resetWatchList();
        if (sname != null) {
            for (var i = 0; i < this.gameData.length; i++) {
                if (this.gameData[i].sname == sname) statergy_to_select = this.gameData[i];
            }
            // no matching name found
            if (statergy_to_select == null) statergy_to_select = this.gameData[0];
        } else {
            statergy_to_select = this.gameData[0];
        }
        this.statergy_to_select = statergy_to_select;
        //  console.log(statergy_to_select);
        var ran = this._getRandom(0, statergy_to_select.questions.length - 1);
        var ran_next = this._getRandom(0, statergy_to_select.questions.length - 1);
        // does not allow current and next question to be same
        while (ran == ran_next)
        {
            var ran = this._getRandom(0, statergy_to_select.questions.length - 1);
            var ran_next = this._getRandom(0, statergy_to_select.questions.length - 1);
        }


        // hold the question    
        var q = statergy_to_select.questions[ran].q;
        var q_next =  statergy_to_select.questions[ran_next].q;
        // hold the arraylist of answers
        var a = statergy_to_select.questions[ran].a;
        var a_next =  statergy_to_select.questions[ran_next].q;
        // arraylist of options

        // list of correctAnswer
        this.correctAnswerTile = [];
        // the slice function will create a copy of arraylist, so we wont destory arraylist
        //   var answersAndOptions = this.getOptions(a.slice(),optionsArrayList.slice());
        // console.log(makeOption);
        // inserts the question at random place    
        // var tile =   this.randomlyInsertNewQuestionTile(q);
      //  this.questionToDisplay.question = q;
        // this.factContent = q + a;
        //var neighbhourCellsAvailable = this.findRelativeAvailableCells(tile);
        //this.insertTileAtAdjacentPosition(neighbhourCellsAvailable,answersAndOptions,a.length);
        this.questionContent[1].question = q;

        this.questionContent[1].symbol = "=";

        this.questionContent[1].answer = a;

        this.questionContent[2].question = q_next;

        this.questionContent[2].symbol = "=";

        this.questionContent[2].answer = a_next;

        this.insertTileWithQuestionAndOperation(this.questionContent);
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
    this.insertTileWithQuestionAndOperation = function(questionContent) {
        var avaiableNeighbhourCells = [];
        for (var i = 0; i < this.row; i++) {
            for (var j = 0; j < this.column; j++) {
                avaiableNeighbhourCells.push({
                    x: j,
                    y: i
                });
            }
        }
        // console.log(optionsArrayList);
        //console.log(a);
        var y =0;

        for (var x = 0; x < avaiableNeighbhourCells.length; x++) {
            var cell = avaiableNeighbhourCells[x];
            var tile;
            tile = this.newTile(cell, questionContent[y].question, false, 0);
            tile.resetChangeColor();
            tile.resetSelected();
            this.insertTile(tile);


            var cell = avaiableNeighbhourCells[++x];
            tile = this.newTile(cell, questionContent[y].symbol, false, 0);
            tile.resetChangeColor();
            tile.resetSelected();
            this.insertTile(tile);

            var cell = avaiableNeighbhourCells[++x];
            tile = this.newTile(cell, "",false, this.questionContent[1].answer[0]);
            tile.resetChangeColor();
            tile.resetSelected();
            this.insertTile(tile);
            ++y;
        }

        /*   for (var x = 0; x < avaiableNeighbhourCells.length; x++) {
        var cell =  avaiableNeighbhourCells[x];
        var tile;
        if( x < no_of_answers )
        {
        tile = this.newTile(cell, answerAndOptions[x],true,false);
        }
        // resetting change color
        // reset selected color
        tile.resetChangeColor();
        tile.resetSelected();
        if(tile.answer)
        {
            this.setAnswerTile(tile)
        }
        this.insertTile(tile);
      } */
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

    this.getCellAtPostion = function(coordinate) {
        return this.tiles[coordinate];

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
    this.newTile = function(pos, value, isAnswer,numberAnswer) {
        return new TileModelThreeDigit(pos, value, isAnswer,numberAnswer);
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
            if (this.factContent[i].select == true) {
                if (this.factContent[i].isAnswer == true) {
                    this.factContent[i].right = true;
                } else {
                    this.factContent[i].wrong = true;
                }
            }
        }
    }
    /* store answer */
    this.clone = function(obj) {
        var copy;
        // Handle the 3 simple types, and null or undefined
        if (null == obj || "object" != typeof obj) return obj;
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
                if (obj.hasOwnProperty(attr)) copy[attr] = this.clone(obj[attr]);
            }
            return copy;
        }
        throw new Error("Unable to copy obj! Its type isn't supported.");
    };

    this.storeAnswer2 = function(tileDetail) {

       // console.log(tileDetail.value);

        if(!tileDetail)
        {
            service.showSubmitButton.truthValue = false;
            return;
        }
        if(tileDetail.value === "" || tileDetail.value === null) {

            service.showSubmitButton.truthValue = false;
            tileDetail.resetSelected();
        }
        else {
            service.showSubmitButton.truthValue = true;
        tileDetail.setSelected();
        }
    }

    this.updateWatchList = function () {

        var watchList = this.watchListContent;
        for(var i= watchList.length-1; i>0 ;i--)
        {
            var m = i - 1;
            watchList[i].fact =  watchList[m].fact;
            watchList[i].select =  watchList[m].select;

            watchList[i].wrong =  watchList[m].wrong;

            watchList[i].right =  watchList[m].right;
            watchList[i].isAnswer =  watchList[m].isAnswer;
        }
        var tile = this.getCellAtPostion(3);

        watchList[i].fact = tile.value;

        watchList[i].select = true;
        watchList[i].wrong =  true;
        watchList[i].right = false;
        watchList[i].isAnswer = true;

    }

    this.evaluateAnswer2 = function () {

        var tile = this.getCellAtPostion(5);
        console.log(tile.numberAnswer);
            if(tile.value == tile.numberAnswer) {
                tile.setAnswer(true);
                tile.setChangeColor();
                return 1;
            }

        tile.setAnswer(false);
        this.updateWatchList();
        tile.setChangeColor();

            return 0;

    }

    this.updateQuestionContent = function(){

        var statergy_to_select = this.statergy_to_select;
        console.log(this.questionContent);
        for(var i=0;i < this.questionContent.length-1; i++)
        {
            this.questionContent[i].question = this.questionContent[i+1].question;
            this.questionContent[i].symbol = "=";
            this.questionContent[i].answer =    this.questionContent[i+1].answer
        }

        var ran =    this._getRandom(0, statergy_to_select.questions.length - 1);
        var q = statergy_to_select.questions[ran].q;
        while (q == this.questionContent[1].question)
        {

            var ran = this._getRandom(0, statergy_to_select.questions.length - 1);
            var q = statergy_to_select.questions[ran].q;
        }
        var a = statergy_to_select.questions[ran].a;
        this.questionContent[2].question = q;
        this.questionContent[2].symbol = "=";
        this.questionContent[2].answer =  a;

    }

    this.removeTopRow = function () {
        for(var i =0;i<3;i++)
            var a = this.removeTile(this._positionToCoordinates(i));

    }

    this.moveMiddleRowTop = function () {
        for(var i =0;i<3;i++) {
           var tile =  this.getCellAtPostion(i+3)
            var a = this.moveTile(tile,this._positionToCoordinates(i));
        }

    }

    this.bottomRowToMiddle = function () {
        for(var i =3;i<6;i++) {
            var tile =  this.getCellAtPostion(i+3)
            var a = this.moveTile(tile,this._positionToCoordinates(i));
        }

    }
    this.addNewBottomRow = function() {

        var tile;
        tile = this.newTile(this._positionToCoordinates(6), this.questionContent[2].question, false, 0);
        tile.resetChangeColor();
        tile.resetSelected();
        this.insertTile(tile);
        tile = this.newTile(this._positionToCoordinates(7), this.questionContent[2].symbol, false, 0);
        tile.resetChangeColor();
        tile.resetSelected();
        this.insertTile(tile);
         tile = this.newTile(this._positionToCoordinates(8), "", false, this.questionContent[2].answer[0]);
        tile.resetChangeColor();
        tile.resetSelected();
        this.insertTile(tile);

    }


        // editing here
    this.showNextQuestions2 = function() {
        this.updateQuestionContent();
        this.removeTopRow();
        this.moveMiddleRowTop();
        this.bottomRowToMiddle();
        this.addNewBottomRow();
        // hold the question
        // arraylist of options

    }


    this.getWatchList= function() {
        return this.watchListContent;
    };


    this.toShowSubmitButton = function(submit) {
        this.showSubmitButton = submit;
        // console.log(submit);
        // console.log("to show submit button");
    }
    this.toShowQuestion = function(question) {
        this.questionToDisplay = question;
        //    console.log(this.questionToDisplay);
    }
    this.toShowNextButton = function(nextButton) {
        this.showNextButton = nextButton;
        //    console.log(this.questionToDisplay);
    }
    this.isAnswerSelected = function() {
        return  this.getCellAtPostion(5).value !== "";
    }
    /*
     * Check to see there are still cells available
     */
    this.anyCellsAvailable = function() {
        return this.availableCells().length > 0;
    };
    return this;
});
})();