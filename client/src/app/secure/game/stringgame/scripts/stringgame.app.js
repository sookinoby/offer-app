(function () {
    'use strict';
    angular
      .module('stringGameApp', ['timer','stringGameKeyboard','stringGameLogic','stringGameCommonService'])
      .controller('stringGameAppController', function (StringGameKeyboardService,stringGameDataService,$log,stringGameManager,$scope) {

        this.gameType = 3;
        this.game = stringGameManager;
        this.levelData = null;
        this.timerToggleButton = false;
        StringGameKeyboardService.destroy();
        StringGameKeyboardService.init();
        $scope.ddSelectOptions = [];
        // the new Game
        this.newGame = function () {
          this.game.initialiseGame($scope.ddSelectSelected.value);
          this.timedGame = this.timerToggleButton;
          this.game.gameOver = false;
          $scope.$broadcast('timer-reset');
          $scope.$broadcast('timer-reset-new', "gameCountDown", 1);
          this.titleOfStrategy = $scope.ddSelectSelected.text;

        };
        $scope.ddSelectSelected = {
          'text': "begin",
          'value': "1"
        };


        this.loadGameData = function () {
          var self = this;
          var scope = $scope;
          var promise = stringGameDataService.getGameData("level.json");
          promise.then(function (data) {
            //  console.log("test" + data.data.GameData);
            self.levelData = data.data.LevelData;

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


        this.timedGame = false;
        $scope.timerRunning = false;

        this.startTimer = function (name) {
          $scope.$broadcast('timer-start', name);
          $scope.timerRunning = true;
        };

        $scope.stopTimer = function () {
          $scope.$broadcast('timer-stop');
          $scope.timerRunning = false;
        };


        this.countDown = function () {
          var self = this;
          $scope.$on('timer-stopped', function (event, args) {
            $scope.$apply(function () {
              self.game.resetTimer();
              if (args.name === "gameCountDown") {
                self.startTimer("gameTimer");
              }
              else if (args.name === "gameTimer") {
                if (self.timedGame) {
                  self.game.gameOver = true;
                }

              }
            });
          });
        };

        this.initialiseCallBack = function () {
          var self = this;
          StringGameKeyboardService.on(function (key) {
            self.game.move(key).then(function () {

            });
          });
        };
        this.initialiseCallBack();
        this.loadGameData();
        this.countDown();
        var self = this;
        $scope.$watch('ddSelectSelected.text', function () {
          if (self.levelData !== null) {
            self.newGame();
          }
        });
      });
  })();
