(function() {
    'use strict';
    angular.module('arrowGame', ['arrowGameLogic', 'ngAnimate', 'ngCookies', 'timer', 'ngDropdowns', 'arrowGameCommonService', 'arrowKeyboard']).controller('arrowGameController', function(arrowGameManager, ArrowGameKeyboardService, $scope, arrowGameDataService, $stateParams,$log) {
            $log.debug("the state param " + $stateParams);
      $log.debug($stateParams);
        if ($stateParams.type === "3") {
            this.gameType = 3;
        }
        else if( this.gameType === "2") {
          this.gameType = 2;
        }
        else {
            this.gameType = 1;
        }
      $log.debug(this.gameType );
      this.levelData = null;
      this.game = arrowGameManager;
      $scope.ddSelectOptions = [];
      this.timerToggleButton = false;
      ArrowGameKeyboardService.destroy();
      ArrowGameKeyboardService.init();
       this.newGame = function() {
            this.game.initialiseGame($scope.ddSelectSelected.value);
            this.timedGame = this.timerToggleButton;
            this.game.gameOver = false;
            $scope.$broadcast('timer-reset');
            $scope.$broadcast('timer-reset-new', "gameCountDown", 1);
            this.titleOfStrategy = $scope.ddSelectSelected.text;

        };
        this.loadGameData = function() {
            var self = this;
            var promise;
            var scope = $scope;
            if( this.gameType === 1 ) {
              $log.debug("one game type");
               promise = arrowGameDataService.getGameData("level.json");
            }
          else if( this.gameType === 2) {
              promise = arrowGameDataService.getGameData("level2.json");
            }
          else {
              promise = arrowGameDataService.getGameData("challenge.json");
          }
            promise.then(function(data) {
                self.initialiseDropDown();

                self.levelData = data.data.LevelData;
                $log.debug(self.levelData);
                for (var i = 0; i < self.levelData.length; i++) {
                    var single_data = {
                        'text': self.levelData[i].name,
                        'value': self.levelData[i].sname
                    };
                    scope.ddSelectOptions.push(single_data);
                }
                self.newGame();
            });
        };

        this.initialiseDropDown = function() {
            if (this.gameType === 2) {
                $scope.ddSelectSelected = {
                    'text': "The Two Minute Challenge",
                    'value': "2min"
                };
                this.timerToggleButton = true;
            }
            if (this.gameType === 1) {
                $scope.ddSelectSelected = {
                    'text': "Count Up By One",
                    'value': "c1"
                };
            }
        };
        this.timedGame = false;
        $scope.timerRunning = false;
        this.startTimer = function(name) {
            $scope.$broadcast('timer-start', name);
            $scope.timerRunning = true;
        };
        $scope.stopTimer = function() {
            $scope.$broadcast('timer-stop');
            $scope.timerRunning = false;
        };
        this.countDown = function() {
            var self = this;
            $scope.$on('timer-stopped', function(event, args) {
                $scope.$apply(function() {
                    self.game.resetTimer();
                    if (args.name === "gameCountDown") {
                        self.startTimer("gameTimer");

                    } else if (args.name === "gameTimer") {
                        if (self.timedGame) {
                            self.game.gameOver = true;
                        }

                    }

                });
            });
        };
        this.initialiseCallBack = function() {
            var self = this;
            ArrowGameKeyboardService.on(function(key) {
                self.game.move(key).then(function() {});
            });
        };
        this.initialiseCallBack();

        this.loadGameData();
        this.countDown();
        var self = this;
        $scope.$watch('ddSelectSelected.text', function(newVal) {

          if(newVal !== undefined)
          {
            if (self.levelData !== null)  {
              self.newGame();
            }
          }
        });
    });
})();
