(function() {
  'use strict';

  angular
    .module('client')
    .factory('isEmailAvailable', usernameService);

  /** @ngInject */
  function usernameService($http,$q,exceptionHandler) {
    return function(email) {
    var deferred = $q.defer();
    $http.get('/api/user/isunique', {params :
      { email:email } }
    ).then(function() {
      // Found the user, therefore not unique.
       deferred.resolve();
    }, function() {
      // User not found, therefore unique!
       deferred.reject();
    });

    return deferred.promise;
    }

  }


})();

