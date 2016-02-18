(function() {
  'use strict';
  var gameDataService = function ($http,$q,$log) {

      this.getGameData = function(gameDataFile)
      {
          $log.debug("Executing the get data service" + gameDataFile);
           var deferred = $q.defer();
           $http.get('app/secure/game/strategy/scripts/game_data/' + gameDataFile).then(function (data)
            {
              //game/game3/scripts/game3/
                deferred.resolve(data);
            });
          return deferred.promise;
      };
  };
angular.module('selectStrategyGameData',[]).service('gameDataService',gameDataService);

}());
