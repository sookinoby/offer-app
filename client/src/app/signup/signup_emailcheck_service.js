(function() {
  'use strict';

  angular
    .module('client')
    .factory('isEmailAvailable', emailService)
    .factory('userNameService',userNameService);

  /** @ngInject */
  function emailService($http,$q,exceptionHandler,CONSTANT_DATA) {
    return function(email) {
    var deferred = $q.defer();
    //var urlForEmail = "http://localhost:65159/api/accounts/checkemail/";
    var urlForEmail = CONSTANT_DATA.base_url + "accounts/checkemail/";
    $http.get(urlForEmail + email)
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

  function userNameService($http,$q,exceptionHandler,CONSTANT_DATA) {
    return function(username) {
      var deferred = $q.defer();
      var urlForUsername = CONSTANT_DATA.base_url + "accounts/checkusername/";
     // var urlForUsername =  "http://localhost:65159/api/accounts/checkusername/";
      $http.get(urlForUsername + username)
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
