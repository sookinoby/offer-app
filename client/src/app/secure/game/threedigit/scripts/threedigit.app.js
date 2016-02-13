(function(){
'use strict';
 angular
.module('threeDigitGameApp', ['threeDigitGameLogic', 'ngAnimate', 'ngCookies','timer','ngDropdowns','threeDigitGameData','threeDigitKeyboard'])
.controller('threeDigitGameController', function(threeDigitGameManager, threeDigitKeyboardService,$scope,threeDigitGameDataService,$log) {

  this.gameType = 4;
  $log.debug("The type is" + this.gameType);
  this.game = threeDigitGameManager;
  this.levelData = null;
  this.timerToggleButton = false;
  threeDigitKeyboardService.destroy();
  threeDigitKeyboardService.init();

  // the new Game
  this.newGame = function() {
  this.game.initialiseGame($scope.ddSelectSelected.value);
    this.timedGame = this.timerToggleButton;
    this.game.gameOver=false;
    $scope.$broadcast('timer-reset');
    $scope.$broadcast('timer-reset-new',"gameCountDown",1);
    this.titleOfStrategy =  $scope.ddSelectSelected.text;

  };

  // load the game data.
  this.loadGameData = function() {
   var self = this;
   var scope = $scope;

   // promise is resolved for getting the gfame data
   var promise= threeDigitGameDataService.getGameData("level.json");

   promise.then(function (data)
    {
     $log.debug( data.data );
     self.levelData  = data.data.LevelData;

     for(var i=0;i < self.levelData.length; i++)
     {
         var single_data = {
         'text' : self.levelData[i].name,
         'value' : self.levelData[i].sname
         };
        scope.ddSelectOptions.push(single_data);
     }
     self.newGame();
    });
  };


  $scope.ddSelectOptions = [];
   $scope.ddSelectSelected = {
         'text' : "Add Zero",
         'value' : "a0"
   };

   this.timedGame = false;
   $scope.timerRunning = false;

   this.startTimer = function (name){
   $scope.$broadcast('timer-start',name);
   $scope.timerRunning = true;
   };

    $scope.stopTimer = function (){

    $scope.$broadcast('timer-stop');
    $scope.timerRunning = false;
    };



    this.countDown = function() {
         var self = this;
      $scope.$on('timer-stopped', function (event, args){

           $scope.$apply(function () {
             self.game.resetTimer();
             if(args.name === "gameCountDown")
             {
                 self.startTimer("gameTimer");
                // $log.debug('Game Count Down ', args);
             }
            else if(args.name === "gameTimer")
             {
                  if(self.timedGame)
                  {
                      self.game.gameOver=true;
                  }
             }



           });
       });
     };

  this.initialiseCallBack = function() {
    var self = this;


      threeDigitKeyboardService.on(function(key) {
      self.game.move(key).then(function() {

      });
    });
  };
    this.initialiseCallBack();
  //  this.countDownTimerStart();

 //   this.startTimer("gameCountDown");

    this.loadGameData();
    this.countDown();

        var self = this;
 $scope.$watch('ddSelectSelected.text', function(newVal, oldVal){
    if(self.levelData != null)
    self.newGame();
  });
});
}
)();
