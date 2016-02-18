(function(){
'use strict';
angular.module('threeDigitGrid', ['threeDigitGameData']).factory('TileModelThreeDigit', function() {
    var Tile = function(pos, val, answer,numberAnswer,toBeFilled) {
        this.x = pos.x;
        this.y = pos.y;
        this.value = val || "";
       // this.id = GenerateUniqueId.next();
        this.merged = null;
        this.selected = false;
        this.answer = answer;
        this.numberAnswer = numberAnswer;
        this.toBeFilled = toBeFilled;
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

    Tile.prototype.setToBeFilled = function(truth) {
    this.toBeFilled = truth;
    };

    Tile.prototype.getToBeFilled = function() {
    return this.toBeFilled;
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
}).service('threeDigitGridService', function(TileModelThreeDigit,$log) {

    this.instantaneousFeedBack = true;
    this.linenumber = 0;
    this.questionCell = null;
    this.watchListLineNumber = 0;
    this.factContent =null;
    this.watchListContent = null;
    this.questionContent = null;
    this.current_qn = 0;
    this.startTime = null;
    this.endTime = null;
    this.next_qn = 1;
    var service = this;

    this.size = 5; // Default size
    this.startingTiles = 15; // default starting tiles
    this.row = 3;
    this.column = 5;
    this.setSize = function(sz) {
        this.size = sz ? sz : 0;
    };

    this.setStartingTiles = function(num) {
        this.startingTiles = num;
    };
    this.storeSelectedPositions = [];
    this.grid = [];
    this.tiles = [];
    this.gameData = [];

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
             'operand1': "",
             'operator': "",
             'operand2': "",
             'symbol' : "",
             'result': "",
             'actualAnswer' : "",
             'wrong' : false

        }, {
             'operand1': "",
             'operator': "",
             'operand2': "",
             'symbol': "",
             'result': "",
             'actualAnswer' : "",
             'wrong' : false
        }, {
             'operand1': "",
             'operator': "",
             'operand2': "",
             'symbol': "",
             'result': "",
             'actualAnswer':"",
             'wrong' : false
        }];
    };

  this.setQuestionCell = function(tile) {
      this.questionCell = tile;
  };

  this.getQuestionCell = function() {
    return this.questionCell;
  };

  this.resetQuestionCell = function() {
    this.questionCell = null;
  };

    /*
     * Build the initial starting position
     * with randomly placed tiles
     */
    this.buildStartingPosition = function() {
        var gameData = this.gameData;
   //     var length_of_questions = gameData.questionList.length;
      /*
       var ran = this._getRandom(0, length_of_questions-1);
       var ran_next = this._getRandom(0, length_of_questions-1);
    //   does not allow current and next question to be same
       while (ran == ran_next)
       {
           var ran = this._getRandom(0, length_of_questions-1);
          var ran_next = this._getRandom(0, length_of_questions-1);
       }
       */
      // hold the question
        this.current_qn = this.next_qn - 1;
        var q = gameData.questionList[this.next_qn-1].q;
        var q_next =  gameData.questionList[this.next_qn].q;
        // hold the arraylist of answers
        var a = gameData.questionList[this.next_qn-1].a[0];
        var a_next =  gameData.questionList[this.next_qn].a[0];
        // arraylist of options

     // $log.log(a);
   //   $log.log(a_next);
        // list of correctAnswer
      this.correctAnswerTile = [];
      this.questionContent[1].operand1 = q[0];
      this.questionContent[1].operator = q[1];
      this.questionContent[1].operand2 = q[2];
      this.questionContent[1].symbol = q[3];
      this.questionContent[1].result = q[4];
      this.questionContent[1].actualAnswer = a;

      this.questionContent[2].operand1 = q_next[0];
      this.questionContent[2].operator = q_next[1];
      this.questionContent[2].operand2 = q_next[2];
      this.questionContent[2].symbol = q_next[3];
      this.questionContent[2].result = q_next[4];
      this.questionContent[2].actualAnswer = a_next;
      this.insertTileWithQuestionAndOperation(this.questionContent);
      var d = new Date();
      this.startTime =  d.getTime();
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
      this.resetWatchList();
      this.resetQuestionCell();
      this.resetQuestionContent();
      this.currentAnswersCells = [];
      this.resetAnswerTile();
      this.current_qn = 0;
      this.startTime = null;
      this.endTime = null;
      this.next_qn = 1;
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
        var y =0;

        for (var x = 0; x < avaiableNeighbhourCells.length; x++) {
            var cell = avaiableNeighbhourCells[x];
            var tile;
              if(questionContent[y].operand1 === "") {
                tile = this.newTile(cell, questionContent[y].operand1, true, questionContent[y].actualAnswer,true);

              }
              else {
                tile = this.newTile(cell, questionContent[y].operand1, false,-1,false);
              }
              tile.resetChangeColor();
              tile.resetSelected();
              this.insertTile(tile);



               cell = avaiableNeighbhourCells[++x];
               if(questionContent[y].operator === "") {
                tile = this.newTile(cell, questionContent[y].operator, true, questionContent[y].actualAnswer,true);

               }
              else {
                tile = this.newTile(cell, questionContent[y].operator, false,-1,false);
              }
            tile.resetChangeColor();
            tile.resetSelected();
            this.insertTile(tile);



          cell = avaiableNeighbhourCells[++x];
          if(questionContent[y].operand2 === "") {
            tile = this.newTile(cell, questionContent[y].operand2, true, questionContent[y].actualAnswer,true);

          }
          else {
            tile = this.newTile(cell, questionContent[y].operand2, false,-1,false);
          }
          tile.resetChangeColor();
          tile.resetSelected();
          this.insertTile(tile);


            cell = avaiableNeighbhourCells[++x];
            tile = this.newTile(cell, questionContent[y].symbol, false, -1,false);
            tile.resetChangeColor();
            tile.resetSelected();
            this.insertTile(tile);

          cell = avaiableNeighbhourCells[++x];
          if(questionContent[y].result === "") {
            tile = this.newTile(cell, questionContent[y].result, true, questionContent[y].actualAnswer,true);

          }
          else {
            tile = this.newTile(cell, questionContent[y].result, false,-1,false);
          }
          tile.resetChangeColor();
          tile.resetSelected();
          this.insertTile(tile);
          y++;

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
    this.newTile = function(pos, value, isAnswer,numberAnswer,toBeFilled) {
        return new TileModelThreeDigit(pos, value, isAnswer,numberAnswer,toBeFilled);
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

    this.storeAnswer2 = function(tileDetail) {

       $log.log(tileDetail.value);

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
          service.setQuestionCell(tileDetail);
          tileDetail.setSelected();
        }
    };



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

      var factString = "";
      for(var k = 5; k < 10; k++)
        {
          var tile =  this.getCellAtPostion(k);
          if(tile.getToBeFilled() === true) {
            factString = factString + " ?";
          }
          else {
            factString = factString + tile.value + " ";
          }
        }

        watchList[i].fact = factString;

        watchList[i].select = true;
        watchList[i].wrong =  true;
        watchList[i].right = false;
        watchList[i].isAnswer = true;
    };

    this.setInstantaneousFeedBack = function (value)
    {
      this.instantaneousFeedBack = value;
    };


    this.evaluateAnswer2 = function () {
    var tile = this.getQuestionCell();
      $log.debug("evaluating");
      $log.debug("the tile value " +  tile.value);
      $log.debug("the tile answer " + tile.numberAnswer);
      this.gameData.questionList[this.current_qn].StudentAnswer = tile.value;
      var d = new Date();
      this.endTime =  d.getTime();
      this.gameData.questionList[this.current_qn].time = this.endTime - this.startTime;
      d = new Date();
      this.startTime = d.getTime();
      if(tile.value !== null && (tile.value+"") === tile.numberAnswer) {
        this.gameData.questionList[this.current_qn].right = true;
        tile.setAnswer(true);
        $log.debug(this.instantaneousFeedBack);
        if( this.instantaneousFeedBack === true ) {
          tile.setChangeColor();
        }
        else {
          tile.resetChangeColor();
          tile.resetSelected();
        }
        tile.setToBeFilled(false);
        $log.log(this.gameData.questionList);
        $log.log("the answer entered was correct");
        return 1;
      }
      $log.log(this.gameData.questionList[this.current_qn]);
      this.gameData.questionList[this.current_qn].right = false;
      tile.setAnswer(false);
      // update the watch list before setting to be filled to false
      this.updateWatchList();
      tile.setToBeFilled(false);
      if(  this.instantaneousFeedBack === true ) {
        tile.setChangeColor();
      }
      else {
        tile.resetChangeColor();
        tile.resetSelected();
      }
      return 0;
   };

    this.updateQuestionContent = function(){

        var gameData = this.gameData;

        for(var i=0;i < this.questionContent.length-1; i++)
        {
          this.questionContent[i].operand1 = this.questionContent[i+1].operand1;
          this.questionContent[i].operator = this.questionContent[i+1].operator;
          this.questionContent[i].operand2 = this.questionContent[i+1].operand2;
          this.questionContent[i].symbol =   this.questionContent[i+1].symbol;
          this.questionContent[i].result =   this.questionContent[i+1].result;
          this.questionContent[i].actualAnswer = this.questionContent[i+1].actualAnswer;
        }
       // var length_of_questions = gameData.questionList.length;
      //  var ran =    this._getRandom(0, length_of_questions-1);

       /*while (q == this.questionContent[1].question)
        {

            var ran = this._getRandom(0, length_of_questions-1);
            var q = gameData.questionList[ran].q;
        }
        */
      var q = gameData.questionList[this.next_qn].q;
      var a = gameData.questionList[this.next_qn].a[0];
      this.questionContent[2].operand1 = q[0];
      this.questionContent[2].operator = q[1];
      this.questionContent[2].operand2 = q[2];
      this.questionContent[2].symbol = q[3];
      this.questionContent[2].result = q[4];
      this.questionContent[2].actualAnswer = a;
    };

    this.removeTopRow = function () {
        for(var i =0;i<5;i++) {
          this.removeTile(this._positionToCoordinates(i));
        }
    };

    this.moveMiddleRowTop = function () {
        for(var i =0;i<5;i++) {
           var tile =  this.getCellAtPostion(i+5);
           this.moveTile(tile,this._positionToCoordinates(i));
        }

    };

    this.bottomRowToMiddle = function () {
        for(var i =5;i<10;i++) {
            var tile =  this.getCellAtPostion(i+5);
           this.moveTile(tile,this._positionToCoordinates(i));
        }

    };
    this.addNewBottomRow = function() {
        var tile;
        var y =2;
        var cell = this._positionToCoordinates(10);
        if(this.questionContent[y].operand1 === "") {
          tile = this.newTile(cell, this.questionContent[y].operand1, true, this.questionContent[y].actualAnswer,true);

        }
        else {
          tile = this.newTile(cell, this.questionContent[y].operand1, false,false,false);
        }
        tile.resetChangeColor();
        tile.resetSelected();
        this.insertTile(tile);

       cell = this._positionToCoordinates(11);
        if(this.questionContent[y].operator === "") {
          tile = this.newTile(cell, this.questionContent[y].operator, true, this.questionContent[y].actualAnswer,true);

        }
        else {
          tile = this.newTile(cell, this.questionContent[y].operator,  false,-1,false);
        }
        tile.resetChangeColor();
        tile.resetSelected();
        this.insertTile(tile);

        cell = this._positionToCoordinates(12);
        if(this.questionContent[y].operand2 === "") {
          tile = this.newTile(cell, this.questionContent[y].operand2, true, this.questionContent[y].actualAnswer,true);

        }
        else {
          tile = this.newTile(cell, this.questionContent[y].operand2,  false,-1,false);
        }
        tile.resetChangeColor();
        tile.resetSelected();
        this.insertTile(tile);


        cell = this._positionToCoordinates(13);
        tile = this.newTile(cell, this.questionContent[y].symbol, false, -1,false);
        tile.resetChangeColor();
        tile.resetSelected();
        this.insertTile(tile);

        cell = this._positionToCoordinates(14);
        if(this.questionContent[y].result === "") {
          tile = this.newTile(cell, this.questionContent[y].result, true, this.questionContent[y].actualAnswer,true);

        }
        else {
          tile = this.newTile(cell, this.questionContent[y].result, false,-1,false);
        }
        tile.resetChangeColor();
        tile.resetSelected();
        this.insertTile(tile);


    };

    this.incrementQuestionCounter = function()
    {
      $log.log(this.gameData.questionList.length);
      if(this.next_qn === (this.gameData.questionList.length - 1))
      {
        this.next_qn = 0;
        this.current_qn = this.gameData.questionList.length - 1;
      }
      else if(this.current_qn ===  (this.gameData.questionList.length - 1))
      {
        this.current_qn = 0;
        this.next_qn = this.next_qn + 1;
      }
      else {
        this.current_qn = this.current_qn + 1;
        this.next_qn = this.next_qn + 1;
      }

    };
        // editing here
    this.showNextQuestions2 = function() {
        this.incrementQuestionCounter();
        this.updateQuestionContent();
        this.removeTopRow();
        this.moveMiddleRowTop();
        this.bottomRowToMiddle();
        this.addNewBottomRow();
        this.resetQuestionCell();
        // hold the question
        // arraylist of options

    };


    this.getWatchList= function() {
        return this.watchListContent;
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
      var questionCell = this.getQuestionCell();

      if( questionCell !== null && questionCell.value !== "") {
        return true;
      }
      return false;

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
