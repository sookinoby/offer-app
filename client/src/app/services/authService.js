(function() {

'use strict';
  angular.module('client').factory('authService', authService )

 function authService($http, $q, localStorageService,jwtHelper,$state,CONSTANT_DATA) {
 // var serviceBase = 'http://localhost:65159/api/';

   var serviceBase = CONSTANT_DATA.oauth_url;

   //http://r2mworks.azurewebsites.net/
   //http://localhost:65159/api/
  var authServiceFactory = {};

  var _authentication = {
    isAuth: false,
    userName : "",
    roleName : ""
  };

  var _saveRegistration = function (registration) {

    return $http.post(serviceBase + 'accounts/create', registration).then(function (response) {
      return response;
    });

  };

   var _saveRegistrationForStudent = function (registration) {

     return $http.post(serviceBase + 'accounts/createstudent', registration).then(function (response) {
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
      localStorageService.set('authorizationData', { token: response.access_token, userName: tokenPayload.unique_name,roleName : tokenPayload.role, mentoruid :tokenPayload.nameid, fullName : tokenPayload.fullName});

      _authentication.isAuth = true;
      _authentication.userName = tokenPayload.unique_name;
      _authentication.roleName = tokenPayload.role;
      _authentication.mentoruid = tokenPayload.nameid;
      _authentication.fullName = tokenPayload.fullName;

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
    _authentication.userName = null;
    _authentication.roleName = null;
    _authentication.mentoruid = null;
    _authentication.fullName = null;
    $state.go("index");

  };

   var _getStudentForMentor = function (username) {

     return $http.get(serviceBase + 'accounts/mentor/' + username + '/getstudentslist').then(function (response) {
       return response;
     });

   };

  var _fillAuthData = function () {

    var authData = localStorageService.get('authorizationData');

 /*   console.log(authData);
    console.log("logging authData");
    if(authData) {
      console.log(authData.fullName);
      console.log(authData.userName);
    } */
    if (authData)
    {
      _authentication.isAuth = true;
      _authentication.userName = authData.userName;
      _authentication.roleName = authData.roleName;
      _authentication.mentoruid = authData.mentoruid;
      _authentication.fullName = authData.fullName;
    }

  }

  authServiceFactory.saveRegistration = _saveRegistration;
  authServiceFactory.login = _login;
  authServiceFactory.logOut = _logOut;
  authServiceFactory.fillAuthData = _fillAuthData;
  authServiceFactory.authentication = _authentication;
  authServiceFactory.saveRegistrationForStudent =  _saveRegistrationForStudent;
  authServiceFactory.getStudentForMentor = _getStudentForMentor;
  return authServiceFactory;
}
})();
