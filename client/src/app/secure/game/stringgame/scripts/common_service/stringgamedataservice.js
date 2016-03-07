(function() {
  'use strict';
  var  stringGameDataService = function ($http,$q,$log) {

      this.getGameData = function(gameDataFile)
      {
        $log.debug(gameDataFile);
           var deferred = $q.defer();

            $http.get('app/secure/game/stringgame/scripts/game_data/' + gameDataFile).then(function (data)
            {
                deferred.resolve(data);
            });
          return deferred.promise;
      };
  };
angular.module('stringGameCommonService',[]).service('stringGameDataService',stringGameDataService);

}());
