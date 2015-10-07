(function() {
  var arrowGameDataService = function ($http,$q) {
   
      this.getGameData = function(gameDataFile)
      {
        
           var deferred = $q.defer();
           var gameDataFile = "gamedata" +gameDataFile + ".json";
            $http.get('app/secure/game/arrow/scripts/common_service/' + gameDataFile).then(function (data)
            {
                deferred.resolve(data);                            
            });
          return deferred.promise;
      }
  };
angular.module('arrowGameCommonService',[]).service('arrowGameDataService',arrowGameDataService);

}());