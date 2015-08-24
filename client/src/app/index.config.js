(function() {
  'use strict';

  angular
    .module('client')
    .config(config);

  /** @ngInject */
  /* */
  function config($logProvider,$httpProvider,$locationProvider, $authProvider,RestangularProvider) {
    // Enable log
    $logProvider.debugEnabled(true);

    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];

    $locationProvider.html5Mode(true);
    // Set options third-party lib
    RestangularProvider.setBaseUrl(
      'http://localhost:10000'
      );

    // set url for login
     $authProvider.loginUrl = 'http://localhost:10000/api/user/login';
     $authProvider.signupUrl = 'http://localhost:10000/api/user/signup';
     $authProvider.loginOnSignup = false;
     $authProvider.loginRedirect = '/home';
  }

})();
