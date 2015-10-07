(function() {
  var gameDataService = function ($http,$q) {
   
      this.getGameData = function(gameDataFile)
      {
           var deferred = $q.defer();
           var gameDataFile = "gamedata" +gameDataFile + ".json";
            $http.get('app/secure/game/strategy/scripts/common_service/' + gameDataFile).then(function (data)
            {
              //game/game3/scripts/game3/
                deferred.resolve(data);                            
            });
          return deferred.promise;
      }
  };
angular.module('selectStrategyGameData',[]).service('gameDataService',gameDataService);

}());