(function() {

'use strict';
  angular.module('client').factory('authService', authService )

 function authService($http, $q, localStorageService,jwtHelper,$state) {
  var serviceBase = 'http://localhost:65159/';
  var authServiceFactory = {};

  var _authentication = {
    isAuth: false,
    userName : ""
  };

  var _saveRegistration = function (registration) {

    return $http.post(serviceBase + 'api/accounts/create', registration).then(function (response) {
      return response;
    });

  };

  var _login = function (loginData) {

    var data = "grant_type=password&username=" + loginData.userName + "&password=" + loginData.password;

    var deferred = $q.defer();

    $http.post(serviceBase + 'oauth/token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (response) {
      console.log(response);
      var tokenPayload = jwtHelper.decodeToken(response.access_token);
      console.log(tokenPayload);
      localStorageService.set('authorizationData', { token: response.access_token, userName: tokenPayload.unique_name});

      _authentication.isAuth = true;
      _authentication.userName = tokenPayload.unique_name;

      deferred.resolve(response);

    }).error(function (err, status) {
      _logOut();
      deferred.reject(err);
    });

    return deferred.promise;

  };

  var _logOut = function () {
     localStorageService.remove('authorizationData');
    _authentication.isAuth = false;
    _authentication.userName = "";
    $state.go("login");

  };

  var _fillAuthData = function () {

    var authData = localStorageService.get('authorizationData');
    if (authData)
    {
      _authentication.isAuth = true;
      _authentication.userName = authData.userName;
    }

  }

  authServiceFactory.saveRegistration = _saveRegistration;
  authServiceFactory.login = _login;
  authServiceFactory.logOut = _logOut;
  authServiceFactory.fillAuthData = _fillAuthData;
  authServiceFactory.authentication = _authentication;

  return authServiceFactory;
}
})();
