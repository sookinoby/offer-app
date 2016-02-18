(function() {
  'use strict';
  var  arrowGameDataService = function ($http,$q,$log) {

      this.getGameData = function(gameDataFile)
      {
        $log.debug(gameDataFile);
           var deferred = $q.defer();

            $http.get('app/secure/game/arrow/scripts/game_data/' + gameDataFile).then(function (data)
            {
                deferred.resolve(data);
            });
          return deferred.promise;
      };
  };
angular.module('arrowGameCommonService',[]).service('arrowGameDataService',arrowGameDataService);

}());
