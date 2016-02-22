(function(){
'use strict';
angular.module('selectStrategyGameLogic', ['selectStrategyGrid'])
.service('SelectStratergyGameManager', function($q, $timeout, SelectStrategyGridService,gameDataService,$log) {

  this.getHighScore = function() {
    return  0;
  };
  this.delay = 1000;
  this.delayedTriggerHolder = null;
  this.delayedTriggerHolder2 = false;
  this.grid = SelectStrategyGridService.grid;
  this.tiles = SelectStrategyGridService.tiles;

  this.storeAnswer = SelectStrategyGridService.storeAnswer;

  this.stats = true;
  this.showQuestion = true;
  // show / hide UI options
  this.scoreButton = false;
  this.watchList = true;
  this.instantaneousFeedBack = false;
  this.pacer = false;
  this.isTimed = false;
  this.changeQuestionAnimation = false;
  this.showNextButton = {};
  this.showSubmitButton = {};
  this.showSubmitButton.truthValue = false;
  this.showNextButton.truthValue = false;
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
/*
  this.isAnswerSelected = function()
  {
      console.log(SelectStrategyGridService.isAnswerSelected());
      return SelectStrategyGridService.isAnswerSelected();
  };
*/
  this.passButton = function()
  {
      SelectStrategyGridService.toShowSubmitButton(this.showSubmitButton);
      SelectStrategyGridService.toShowNextButton(this.showNextButton);
  };

  this.passButton();

  this.evaluateAnswer = function()
  {
     $log.debug("evaluate called");
     this.showSubmitButton.truthValue = false;
     this.showNextButton.truthValue = true;
     var score = SelectStrategyGridService.evaluateAnswer();
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
    // console.log("test");
  };

  this.showNextQuestions = function()
  {
      $log.debug("Show next question is called");
      this.showNextButton.truthValue = false;
      this.changeQuestionAnimation = true;
      this.showSubmitButton.truthValue = false;
      var self = this;
      if(self.delayedTriggerHolder2 === false) {
      self.delayedTriggerHolder2 = true;
      $timeout(function () {
        $log.debug("time out fired really");
        self.changeQuestionAnimation = false;
        SelectStrategyGridService.deleteCurrentBoard();
        self.totalfacts = self.totalfacts + 1;
        SelectStrategyGridService.buildStartingPosition();
        SelectStrategyGridService.resetFactContent();
        self.factContent = SelectStrategyGridService.getFactContent();
        self.rightAnswer = false;
        self.netural = true;
        self.delayedTriggerHolder2 = false;
      }, 100);
    }

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

  this.newGame = function(gameData,nameOfStrategy) {
    var self = this;
    if(self.delayedTriggerHolder)
    {
      $timeout.cancel(self.delayedTriggerHolder);
    }
    this.questionToDisplay = {};
    SelectStrategyGridService.resetFactContent();
    SelectStrategyGridService.deleteCurrentBoard();
    SelectStrategyGridService.toShowQuestion(this.questionToDisplay);
    SelectStrategyGridService.buildDataForGame(gameData,nameOfStrategy);
    SelectStrategyGridService.buildEmptyGameBoard();

    self.delayedTriggerHolder = $timeout(function tobuilstartinPosition() {
    self.positionToInsert = SelectStrategyGridService.buildStartingPosition();
    $log.debug('update with timeout fired');
    }, self.delay);

    this.factContent =  SelectStrategyGridService.getFactContent();
    this.reinit();
  };

    this.initialiseGame = function(nameOfStrategy) {
      var self = this;
      $log.debug(nameOfStrategy);
      var promise = gameDataService.getGameData(nameOfStrategy +".json");
      promise.then(function (data) {
        self.gameData = data.data.gameData;
        $log.debug(self.gameData);
        self.newGame(self.gameData);
        self.setScoreButton(self.gameData.ScoreButton);
        self.setInstantaneousFeedBack(self.gameData.InstantaneousFeedBack);
        SelectStrategyGridService.setInstantaneousFeedBack(self.gameData.InstantaneousFeedBack);
        self.setPacer(self.gameData.Pacer);
        self.setWatchList(self.gameData.WatchList);
        self.setIsTimed(self.gameData.IsTimed);

      });
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

 /*     if(!self.countdownfinished)
          return;
       if(self.gameOver)
           return true;
           */

      if(self.win) { return false; }
      if(key === "enter")
      {
        self.enterCount++;
        if(SelectStrategyGridService.isAnswerSelected() === true)
        {
              if(self.enterCount === 1)
              {
             self.evaluateAnswer();
              }
             if(self.enterCount === 2)
             {
           // console.log("counter");
             self.showNextQuestions();

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
     // console.log(newScore + "ff");
    this.currentScore = this.currentScore + newScore;
    if(this.currentScore > this.getHighScore()) {
      this.highScore = this.currentScore + newScore;
    }
  };

});
})();
