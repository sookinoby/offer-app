(function() {
    'use strict';
    angular.module('arrowGameLogic', ['arrowGameGrid']).service('arrowGameManager', function($q, $timeout, arrowGameService,arrowGameDataService, $log) {
        this.delay = 1000;
        this.delayedTriggerHolder = null;
        this.positionToInsert = {};
        this.grid = arrowGameService.grid;
        this.tiles = arrowGameService.tiles;
        this.gameData = null;
        this.gameOver = false;
        this.showNextButton = {};
        this.showSubmitButton = {};
      // show/hide UI options
        this.scoreButton = false;
        this.watchList = true;
        this.instantaneousFeedBack = false;
        this.pacer = false;
        this.isTimed = false;

        this.showSubmitButton.truthValue = false;
        this.showNextButton.truthValue = false;
        // this.winningValue = 2048;
        this.stats = true;
        this.rightAnswer = false;
        this.netural = true;



        this.indexOf = function(needle) {
        var indexOf;
        if(typeof Array.prototype.indexOf === 'function') {
          indexOf = Array.prototype.indexOf;
        } else {
          indexOf = function(needle) {
            var index = -1;

            for(var i = 0; i < this.length; i++) {
              if(this[i] === needle) {
                index = i;
                break;
              }
            }

            return index;
          };
        }

        return indexOf.call(this, needle);
      };

        this.resetTimer = function() {
            this.countdownfinished = true;
        };
        this.changeStats = function() {
            this.stats = !this.stats;
        };
        this.reinit = function() {
            this.gameOver = false;
            this.win = false;
            this.currentScore = 0;
            this.totalfacts = 0;
            this.counter = 1;
            this.countdownfinished = false;
            this.enterKeyCount = 0;
        };
        this.reinit();

        this.initialiseGame = function(nameOfStrategy) {
          var self = this;
          var promise = arrowGameDataService.getGameData(nameOfStrategy +".json");
          promise.then(function (data) {
          self.gameData = data.data.gamedata;
          self.newGame(self.gameData);
          self.setScoreButton(self.gameData.scoreButton);
          self.setInstantaneousFeedBack(self.gameData.instantaneousFeedBack);
          arrowGameService.setInstantaneousFeedBack(self.gameData.instantaneousFeedBack);
          self.setPacer(self.gameData.pacer);
          self.setWatchList(self.gameData.watchList);
          self.setIsTimed(self.gameData.isTimed);

        });
        };

        this.passButton = function() {
        arrowGameService.passSubmitButton(this.showSubmitButton);
        arrowGameService.passNextButton(this.showNextButton);
        };
        this.passButton();

        this.newGame = function(gameData) {
            var self = this;
            if(self.delayedTriggerHolder)
            {
                $timeout.cancel(self.delayedTriggerHolder);
            }
            arrowGameService.deleteCurrentBoard();
            arrowGameService.buildDataForGame(gameData);
            arrowGameService.buildEmptyGameBoard();
            self.delayedTriggerHolder = $timeout(function toBuildStartinPosition() {
                self.positionToInsert = arrowGameService.buildStartingPosition();
                $log.debug('update with timeout fired ');
            }, self.delay);

            this.netural = true;
            this.showSubmitButton.truthValue = false;
            arrowGameService.resetFactContent();
            this.factContent = arrowGameService.getFactContent();
            this.reinit();
        };

        this.showNextQuestions = function() {
            this.enterKeyCount = 0;
            arrowGameService.resetFactContent();
            this.factContent = arrowGameService.getFactContent();
            arrowGameService.deleteCurrentBoard();
            this.positionToInsert = arrowGameService.buildStartingPosition(this.positionToInsert);
            this.showNextButton.truthValue = false;
            this.netural = true;
            this.rightAnswer = false;
        };

        this.evaluateAnswer = function() {
            var points_for_questions = arrowGameService.evaluateAnswer();
            if (points_for_questions !== null && points_for_questions > 0) {
                this.updateScore(this.currentScore + points_for_questions);
                this.factContent = arrowGameService.getFactContent();
                this.rightAnswer = true;
                this.netural = false;
                this.counter++;
            }
            // the answer was wrong
            else {
                this.rightAnswer = false;
                this.netural = false;
            }
            this.totalfacts++;
            this.showSubmitButton.truthValue = false;
            this.showNextButton.truthValue = true;
        };

      this.setScoreButton = function(value) {
        this.scoreButton = value;
      };

      this.setPacer = function(value) {
        this.pacer = value;
      };

      this.setWatchList = function(value) {
        $log.debug("wacthList" + this.watchList);
        this.watchList = value;
      };

      this.setInstantaneousFeedBack = function(value) {
        this.instantaneousFeedBack  = value;
      };

      this.setIsTimed = function(value) {
        this.isTimed  = value;
      };
        /*
         * The game loop
         *
         * Inside here, we'll run every 'interesting'
         * event (interesting events are listed in the Keyboard service)
         * For every event, we'll:
         *  1. look up the appropriate vector
         *  2. find the furthest possible locations for each tile and
         *     the next tile over
         *  3. find any spots that can be 'merged'
         *    a. if we find a spot that can be merged:
         *      i. remove both tiles
         *      ii. add a new tile with the double value
         *    b. if we don't find a merge:
         *      i. move the original tile
         */
        this.move = function(key) {
            var self = this;
            //  console.log(key);
            var f = function() {
                if (!self.countdownfinished) { return;}
                if (self.gameOver) { return true;}
                if (self.win) {
                    return false;
                }
                if (key === "enter") {
                    if (arrowGameService.getLineNumber() === 0)
                    {
                      self.enterKeyCount = 0;
                      return;
                    }
                    self.enterKeyCount++;
                    if (self.enterKeyCount === 1) {
                        self.evaluateAnswer();
                    } else if (self.enterKeyCount === 2) {
                        self.showNextQuestions();
                    }
                } else {
                    if (self.enterKeyCount === 0) {

                        if (arrowGameService.checkIfKeyPressAllowed(key)) {
                            //   self.showSubmitButton.truthValue = true;
                            arrowGameService.storeAnswerAndSelectTileForProcessing(key);
                            // var result = arrowGameService.checkIfAnswerIsValid(key);
                            self.factContent = arrowGameService.getFactContent();
                        } else {
                            // this means the key was duplicate.
                        }
                    }
                }
            };
            return $q.when(f());
        };
        this.updateScore = function(newScore) {
            this.currentScore = newScore;
        };
    });
})();
