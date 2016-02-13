(function() {
  'use strict';
  var threeDigitGameDataService = function ($http,$q,$log) {

      this.getGameData = function(gameDataFile)
      {
          $log.debug(gameDataFile);
           var deferred = $q.defer();
            $http.get('app/secure/game/threedigit/scripts/game_data/' + gameDataFile).then(function (data)
            {
              //game/game3/scripts/game3/
                deferred.resolve(data);
            });
          return deferred.promise;
      };
  };
angular.module('threeDigitGameData',[]).service('threeDigitGameDataService',threeDigitGameDataService);

}());
