(function() {
  'use strict';
  angular.module('client').factory('authInterceptorService', authInterceptorService)

  function authInterceptorService ($q, $location, localStorageService,$injector) {

  var authInterceptorServiceFactory = {};

  var _request = function (config) {

    config.headers = config.headers || {};

    var authData = localStorageService.get('authorizationData');
    if (authData) {
      config.headers.Authorization = 'Bearer ' + authData.token;
    }

    return config;
  }

  var _responseError = function (rejection) {
    if (rejection.status === 401) {
      var stateService = $injector.get('$state');
      stateService.go('unauthorized');
    }
    return $q.reject(rejection);
  }

  authInterceptorServiceFactory.request = _request;
  authInterceptorServiceFactory.responseError = _responseError;

  return authInterceptorServiceFactory;
}
})();

