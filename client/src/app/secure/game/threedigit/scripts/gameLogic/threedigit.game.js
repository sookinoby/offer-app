(function(){
  'use strict';
  angular.module('threeDigitGameLogic', ['threeDigitGrid'])
    .service('threeDigitGameManager', function($q, $timeout, threeDigitGridService,threeDigitGameDataService,$log) {

      this.getHighScore = function() {
        return  0;
      };
      this.delay = 1000;
      this.delayedTriggerHolder = null;
      this.grid = threeDigitGridService.grid;
      this.tiles = threeDigitGridService.tiles;
      this.gameData = null;
      this.storeAnswer = threeDigitGridService.storeAnswer;
      this.watchList = null;
      //this.winningValue = 2048;
      this.stats = true;
      this.showNextButton = {};
      this.showSubmitButton = {};
      this.showSubmitButton.truthValue = false;
      this.showNextButton.truthValue = false;
      this.questionToDisplay = {};
      this.enterCount = 0;
      this.totalfacts = 0;
      this.rightAnswer = false;
      this.netural  = true;
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

      this.resetTimer = function(){
        this.countdownfinished = true;
      };

      this.changeStats = function()  {
        this.stats  = !this.stats;
      };

      this.passButton = function()
      {
        threeDigitGridService.toShowSubmitButton(this.showSubmitButton);
        threeDigitGridService.toShowNextButton(this.showNextButton);
      };

      this.passButton();

      this.evaluateAnswer2 = function()
      {
        var score = threeDigitGridService.evaluateAnswer2();
        this.showSubmitButton.truthValue = false;
        this.showNextButton.truthValue = true;
        if(score > 0)
        {
          this.rightAnswer = true;
          this.netural  = false;

          this.updateScore(score);
        }
        else
        {   this.netural  = false;
          this.rightAnswer = false;
        }

      };

      this.showNextQuestions = function()
      {

        this.totalfacts =  this.totalfacts + 1;
        threeDigitGridService.deleteCurrentBoard();
        threeDigitGridService.buildStartingPosition();
        threeDigitGridService.resetWatchList();

        this.watchList = threeDigitGridService.getWatchList();
        this.rightAnswer = false;
        this.netural  = true;
        this.showNextButton.truthValue = false;
        this.showSubmitButton.truthValue = false;
      };

      this.showNextQuestions2 = function()
      {
        $log.debug("show next question");
        this.totalfacts =  this.totalfacts + 1;
        threeDigitGridService.showNextQuestions2();
        this.watchList = threeDigitGridService.getWatchList();
        this.rightAnswer = false;
        this.netural  = true;
        this.showNextButton.truthValue = false;
        this.showSubmitButton.truthValue = false;
      };



      this.reinit = function() {
        this.gameOver = false;
        this.win = false;
        this.currentScore = 0;
        this.totalfacts = 0;
        this.highScore = this.getHighScore();
        this.countdownfinished = false;
        this.showSubmitButton.truthValue = false;
        this.enterCount = 0;
        this.rightAnswer = false;
        this.netural  = true;

      };
      this.reinit();

      this.initialiseGame = function(nameOfStrategy) {
        var self = this;
        var promise = threeDigitGameDataService.getGameData(nameOfStrategy +".json");
        promise.then(function (data) {
          self.gameData = data.data.gamedata;
          self.newGame(self.gameData);

        });
      };

      this.newGame = function(gameData) {
        var self = this;
        if(self.delayedTriggerHolder)
        {
          $timeout.cancel(self.delayedTriggerHolder);
        }


        this.questionToDisplay = {};
        threeDigitGridService.deleteCurrentBoard();
        threeDigitGridService.buildDataForGame(gameData);
        threeDigitGridService.buildEmptyGameBoard();

        self.delayedTriggerHolder = $timeout(function tobuilstartinPosition() {
          self.positionToInsert = threeDigitGridService.buildStartingPosition();
          $log.debug('update with timeout fired');
        }, self.delay);

        this.watchList =  threeDigitGridService.getWatchList();
        this.reinit();
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

        var f = function() {

          /*     if(!self.countdownfinished)
           return;
           if(self.gameOver)
           return true;
           */

          if(self.win) { return false; }
          if(key === "up")
          {
            $log.debug("up arrow pressed");
          }
          if(key === "enter")
          {
            self.enterCount++;
            if(threeDigitGridService.isAnswerSelected() === true)
            {

              if(self.enterCount === 1)
              {
                self.evaluateAnswer2();
              }
              if(self.enterCount === 2)
              {

                self.showNextQuestions2();

                self.enterCount = 0;
              }

            } else {
              self.enterCount = 0;
            }

          }

        };
        return $q.when(f());
      };

      this.updateScore = function(newScore) {

        this.currentScore = this.currentScore + newScore;
        if(this.currentScore > this.getHighScore()) {
          this.highScore = this.currentScore + newScore;
        }
      };

    });
})();
