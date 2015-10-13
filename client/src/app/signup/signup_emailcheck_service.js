(function() {
  'use strict';

  angular
    .module('client')
    .factory('isEmailAvailable', emailService)
    .factory('userNameService',userNameService);

  /** @ngInject */
  function emailService($http,$q,exceptionHandler) {
    return function(email) {
    var deferred = $q.defer();
    $http.get('http://localhost:65159/api/accounts/checkemail/' + email)
      .then(function() {
      // Found the user, therefore not unique.
        deferred.reject();
    }, function() {
      // User not found, therefore unique!
        deferred.resolve();
    });

    return deferred.promise;
    }

  }

  function userNameService($http,$q,exceptionHandler) {
    return function(username) {
      var deferred = $q.defer();
      $http.get('http://localhost:65159/api/accounts/checkusername/' + username)
        .then(function() {
          // Found the user, therefore not unique.
          deferred.reject();
        }, function() {
          // User not found, therefore unique!
          deferred.resolve();
        });

      return deferred.promise;
    }

  }


})();

/*  $http.get('http://localhost:65159/api/accounts/user/check', {params :
 { email:email } }
 ) */
