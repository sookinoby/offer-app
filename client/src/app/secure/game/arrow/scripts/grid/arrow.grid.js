(function() {
    'use strict';
    angular.module('arrowGameGrid', []).factory('ArrowTileModel', function($log) {
        var Tile = function Tile(pos, val, answer, question) {
            this.x = pos.x;
            this.y = pos.y;
            this.value = val;
            this.answer = answer;
            this.question = question;
            this.merged = null;
            this.changeColor = false;
            this.selected = false;
            this.
            default = true;
        };
        Tile.prototype.savePosition = function savePosition() {
            this.originalX = this.x;
            this.originalY = this.y;
        };
        Tile.prototype.setChangeColor = function setChangeColor() {
            this.
            default = false;
            this.changeColor = true;
        };
        Tile.prototype.flip = function flip() {
            this.selected = !this.selected;
        };
        Tile.prototype.resetChangeColor = function resetChangeColor() {
            this.
            default = true;
            this.changeColor = false;
        };
        Tile.prototype.setSelected = function() {
            this.selected = true;
        };
        Tile.prototype.getSelected = function() {
            return this.selected;
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
    }).provider('arrowGameService', function() {
        this.size = 4; // Default size
        //  this.startingTiles = 1; // default starting tiles
        this.currentQuestionCells;
        this.selectedAnswer = [];
        this.showSubmitButton = null;
        this.showNextButton = null;
        this.linenumber = 0;
        this.factContent;
        this.currentAnswersCells = [];
        this.setSize = function(sz) {
            this.size = sz ? sz : 0;
        };
        var service = this;
        this.$get = function(ArrowTileModel, $log) {
            this.grid = [];
            this.tiles = [];
            this.gameData = [];
            this.nameOfStrategy = null;
            this.storeSelectedPositions = [];
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
            /* clone the object answer */
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
            this.buildDataForGame = function(gameData, nameOfStrategy) {
                this.gameData = gameData;
                this.nameOfStrategy = nameOfStrategy;
            };
            /*
             * builds empty game board
             *
             */
            this.buildEmptyGameBoard = function() {
                var self = this;
                // Initialize our grid
                for (var x = 0; x < service.size * service.size; x++) {
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
             * cleans the cell
             *
             */
            this.cleanupCells = function() {
                var self = this;
                this.forEach(function(x, y, tile) {
                    if (tile && tile.merged) {
                        self.removeTile(tile);
                    }
                });
            };
            /*
             *  sets the answer tile
             *
             */
            this.setAnswerTile = function(tile) {
                this.correctAnswerTile.push(tile);
            }
            /*
             * returns the answer tile
             *
             */
            this.getAnswerTile = function() {
                return this.correctAnswerTile;
            }
            /*
             * Resets answer tile during new round of question
             *
             */
            this.resetAnswerTile = function(tile) {
                this.correctAnswerTile = null;
            }
            /*
             * Checks if given cell is with the grid
             * with randomly placed tiles
             */
            this.withinGrid = function(cell) {
                return cell.x >= 0 && cell.x < this.size && cell.y >= 0 && cell.y < this.size;
            };
            /*
             * Build the initial starting position
             * with randomly placed tiles
             */
            this._getRandom = function(min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            };
            /*
             * Build the answer plus remaining optionsArray
             *
             */
            this.getOptions = function getOptions(answer, optionsArrayList) {
                var makeOption = [];
                for (var x = 0; x < answer.length; x++) {
                    makeOption.push(answer[x]);
                }
                for (var x = 0; x < 4 - answer.length; x++) {
                    var ran = this._getRandom(0, (optionsArrayList.length - 1));
                    var op = optionsArrayList.splice(ran, 1).toString();
                    $log.debug(op);
                    makeOption.push(op);
                }
                return makeOption;
            };
            /* 
             * reset the fact content to initial position
             */
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
                }, {
                    'fact': '-',
                    'select': false,
                    'wrong': false,
                    'right': false,
                    'isAnswer': false
                }];
            }
            /* 
             *function to build the starting position of game
             */
            this.buildStartingPosition = function(placeToInsert) {
                var sname = this.nameOfStrategy;
                var statergy_to_select = null;
                if (sname != null) {
                    for (var i = 0; i < this.gameData.length; i++) {
                        if (this.gameData[i].sname == sname) statergy_to_select = this.gameData[i];
                    }
                    // no matching name found
                    if (statergy_to_select == null) statergy_to_select = this.gameData[0];
                } else {
                    statergy_to_select = this.gameData[0];
                }
                //  console.log(statergy_to_select);
                var ran = this._getRandom(0, statergy_to_select.questions.length - 1);
                // hold the question    
                var q = statergy_to_select.questions[ran].q;
                // hold the arraylist of answers
                var a = statergy_to_select.questions[ran].a;
                // arraylist of options
                var optionsArrayList = statergy_to_select.questions[ran].o;
                // list of correctAnswer
                this.correctAnswerTile = [];
                // the slice function will create a copy of arraylist, so we wont destory arraylist
                var answersAndOptions = this.getOptions(a.slice(), optionsArrayList.slice());
                // console.log(makeOption);
                // inserts the question at random place    
                var tile = this.randomlyInsertNewQuestionTile(q, placeToInsert);
                this.points_for_questions = 0;
                // this.factContent = q + a;
                var neighbhourCellsAvailable = this.findRelativeAvailableCells(tile);
                this.insertTileAtAdjacentPosition(neighbhourCellsAvailable, answersAndOptions, a.length);
                this.currentQuestionCells = tile;
                this.currentAnswersCells = neighbhourCellsAvailable;
                // console.log(neighbhourCellsAvailable);
                return neighbhourCellsAvailable[0];
            };
            /*
             * deletes the current board
             */
            this.deleteCurrentBoard = function() {
                if (this.currentAnswersCells != undefined && this.currentQuestionCells != null) {
                    this.storeSelectedPositions = [];
                    this.showSubmitButton.truthValue = false;
                    this.showNextButton.truthValue = false;
                    this.removeTile(this.currentQuestionCells);
                    for (var x = 0; x < this.currentAnswersCells.length; x++) {
                        this.removeTile(this.currentAnswersCells[x]);
                    }
                    this.currentAnswersCells = [];
                    this.currentQuestionCells = null;
                    this.resetAnswerTile();
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
            this.forEach = function(cb) {
                var totalSize = service.size * service.size;
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
            this.newTile = function(pos, value, answer, question) {
                return new ArrowTileModel(pos, value, answer, question);
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
             * Randomly insert a new tile
             */
            this.randomlyInsertNewQuestionTile = function(question, placeToInsert) {
                var cell = null;
                //   console.log("Testing 1");
                if (placeToInsert == null || placeToInsert == {}) {
                    cell = this.randomAvailableCell(); // Sooki edited it the for not making it random  {x:1,y:2},
                    //    console.log(cell);
                } else {
                    //  console.log("Testing 2");
                    cell = placeToInsert;
                    //     console.log(cell);
                }
                var tile = this.newTile(cell, question, false, true);
                this.insertTile(tile);
                return tile;
            };
            /* 
             * code edited by suresh
             */
            this.shuffle = function(o) { //v1.0
                for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
                return o;
            };
            this.getFactContent = function() {
                return this.factContent;
            };
            this.findRelativeAvailableCells = function(tile) {
                var x = tile.x;
                var y = tile.y;
                var avaiableNeighbhourCells = []
                if (x + 1 < service.size) {
                    avaiableNeighbhourCells.push({
                        x: x + 1,
                        y: y
                    });
                }
                if (x - 1 >= 0) {
                    avaiableNeighbhourCells.push({
                        x: x - 1,
                        y: y
                    });
                }
                if (y - 1 >= 0) {
                    avaiableNeighbhourCells.push({
                        x: x,
                        y: y - 1
                    });
                }
                if (y + 1 < service.size) {
                    avaiableNeighbhourCells.push({
                        x: x,
                        y: y + 1
                    });
                }
                return avaiableNeighbhourCells;
            };
            this.insertTileAtAdjacentPosition = function(avaiableNeighbhourCells, answerAndOptions, no_of_answers) {
                avaiableNeighbhourCells = this.shuffle(avaiableNeighbhourCells);
                for (var x = 0; x < avaiableNeighbhourCells.length; x++) {
                    var cell = avaiableNeighbhourCells[x];
                    var tile;
                    if (x < no_of_answers) {
                        tile = this.newTile(cell, answerAndOptions[x], true, false);
                    } else {
                        tile = this.newTile(cell, answerAndOptions[x], false, false);
                    }
                    // resetting change color
                    // reset selected color
                    tile.resetChangeColor();
                    tile.resetSelected();
                    if (tile.answer) {
                        this.setAnswerTile(tile)
                    }
                    this.insertTile(tile);
                }
            };
           
            // this function actually marks (changes the color) of  the a selected answer
            this.storeAnswerAndSelectTileForProcessing = function(key, tileDetail) {
                // the user has already clicked on the nexbutton
                if(tileDetail)
                $log.debug(tileDetail.x + " , " + tileDetail.y)
                if (service.showNextButton.truthValue) return;
                var question_tile = service.currentQuestionCells;
                var ques_x = question_tile.x;
                var ques_y = question_tile.y;
                // check if the selected tile is the question tile. If so, return ;
                if (tileDetail !== undefined) {
                    if (ques_x == tileDetail.x && ques_y == tileDetail.y) return;
                }
                var guessed_answer;
                if (tileDetail !== undefined) {
                    var cal_x = tileDetail.x;
                    var cal_y = tileDetail.y;
                    guessed_answer = tileDetail;
                 
                } else {
                    var vector = vectors[key];
                    var cal_x = ques_x + vector.x;
                    var cal_y = ques_y + vector.y;
                    guessed_answer = service.getCellAt({
                        x: cal_x,
                        y: cal_y
                    });
                }
                if (guessed_answer == null) {
                    return false;
                }
                //   if (guessed_answer.getSelected()) return false;
                // check if the guessed answer value is the question tile. If so, return ;
                if (guessed_answer.value == service.currentQuestionCells.value) return false;
                ///             //logic to check if the selected or the guessed cell is already selected
                var location = service._coordinatesToPosition({
                    x: guessed_answer.x,
                    y: guessed_answer.y
                });
                var index = service.storeSelectedPositions.indexOf(location);
                //i the selected answer is not already in selected list implies this is new answer selection

                if (index == -1) {
                    if (service.linenumber == 4) return;
                    guessed_answer.flip();
                    service.storeSelectedPositions.push(service._coordinatesToPosition({
                        x: guessed_answer.x,
                        y: guessed_answer.y
                    }));
                    service.factContent[service.linenumber].fact = question_tile.value.split("+")[0] + " + " + guessed_answer.value;
                    service.factContent[service.linenumber].select = true;
                    service.factContent[service.linenumber].isAnswer = guessed_answer.answer;
                    //  console.log(this.factContent);
                    service.linenumber++;
                    //   console.log(service.factContent);
                } else {
                    // the selected answer is already in selected list. So user is trying to unslected
                    service.storeSelectedPositions.splice(index, 1);
                    guessed_answer.flip();
                    var tile = service.getCellAt({
                        x: guessed_answer.x,
                        y: guessed_answer.y
                    })
                    var buildFact = question_tile.value.split("+")[0] + " + " + guessed_answer.value
                    for (var i = 0; i < service.factContent.length; i++) {

                        if (service.factContent[i].fact == buildFact) {
                            service.factContent[i].fact = "-";
                            service.factContent[i].select = false;
                            service.factContent[i].isAnswer = false;
                            service.linenumber--;
                        }
                    }
                    var temp_factContent = service.clone(service.factContent);
                    var k = 0;
                    var length = service.factContent.length;
                    // this loop copies everything in fact content that is not "-". 
                    for (var i = 0; i < service.factContent.length; i++) {
                        //  console.log(service.factContent[i].fact)
                        if (service.factContent[i].fact != "-") {
                            temp_factContent[k].fact = service.factContent[i].fact;
                            temp_factContent[k].select = service.factContent[i].select;
                            temp_factContent[k].isAnswer = service.factContent[i].isAnswer;
                            $log.debug("the fact" + temp_factContent[k].fact)
                            $log.debug("the select" + temp_factContent[k].select)
                            $log.debug("the answer" + temp_factContent[k].isAnswer)
                            k++;
                        }
                    }
                    // this loop copies the clone temp_factContent back to factContent
                    for (var i = 0; i < k; i++) {
                        service.factContent[i].fact = temp_factContent[i].fact;
                        service.factContent[i].select = temp_factContent[i].select;
                        service.factContent[i].isAnswer = temp_factContent[k].isAnswer;
                    }
                    for (var j = k; j < length; j++) {
                        service.factContent[j].fact = "-";
                        service.factContent[j].select = false;
                        service.factContent[j].isAnswer = false;
                    }
                    //      console.log(service.factContent);
                    //    console.log(temp_factContent);
                }
                if (service.storeSelectedPositions.length !== 0) service.showSubmitButton.truthValue = true;
                else service.showSubmitButton.truthValue = false;
            }
            this.factContentColorChange = function() {
                for (var i = 0; i < 4; i++) {
                    if (this.factContent[i].select == true) {
                        if (this.factContent[i].isAnswer == true) {
                            this.factContent[i].right = true;
                            $log.debug(this.factContent[i]);
                        } else {
                            this.factContent[i].wrong = true;
                        }
                    }
                }
            }
            this.checkIfKeyPressAllowed = function(key) {
                var vector = vectors[key];
                var tile = this.currentQuestionCells;
                var ques_x = tile.x;
                var ques_y = tile.y;
                var cal_x = tile.x + vector.x;
                var cal_y = tile.y + vector.y;
                var guessed_answer = this.getCellAt({
                    x: cal_x,
                    y: cal_y
                });
                //  console.log(guessed_answer)
                if (guessed_answer == null) {
                    return false;
                }
                return true;
            }
            this.evaluateAnswer = function evaluateAnswer() {
                var isAnswerCorrect = true;
                for (var i = 0; i < this.storeSelectedPositions.length; i++) {
                    // console.log(this.storeSelectedPositions);
                    var vector = this._positionToCoordinates(this.storeSelectedPositions[i]);
                    var guessed_answer = this.getCellAt({
                        x: vector.x,
                        y: vector.y
                    });
                    var points_for_questions = 0;
                    //  console.log(guessed_answer)
                    if (guessed_answer == null) {
                        continue;
                    }
                    var result = guessed_answer.answer;
                    //  console.log(guessed_answer);
                    if (result == false) {              
                        guessed_answer.setChangeColor();
                        var right_answers = this.getAnswerTile();
                        for (var j = 0; j < right_answers.length; j++) {
                            var right_answer = right_answers[j];
                            right_answer.setChangeColor();
                            //  alert(result);
                        }
                        isAnswerCorrect = false;
                    } else if (result) {
                        points_for_questions = points_for_questions + 1;
                        // console.log("correct answer");
                      //  guessed_answer.resetSelected();
                        guessed_answer.setChangeColor();
                        var right_answers = this.getAnswerTile();
                        for (var j = 0; j < right_answers.length; j++) {
                            var right_answer = right_answers[j];
                            right_answer.setChangeColor();
                            //  alert(result);
                        }
                        //   alert(result);
                    }
                }
                $log.debug(points_for_questions);
                this.factContentColorChange();
                if(isAnswerCorrect === true)
                    return points_for_questions;
                else {
                    return 0;
                }
            };

            this.passSubmitButton = function(submitButton) {
                this.showSubmitButton = submitButton;
            };
            this.passNextButton = function(nextButton) {
                this.showNextButton = nextButton;
            };
            this.getLineNumber = function() {
                return service.linenumber;
            }
            /* finished code edited by suresh */
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
            /*
             * Check to see there are still cells available
             */
            this.anyCellsAvailable = function() {
                return this.availableCells().length > 0;
            };
            return this;
        };
    });
}());