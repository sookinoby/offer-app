(function() {
  'use strict';

  angular
    .module('client')
    .config(config);

  /** @ngInject */
  /* */
  function config($logProvider,$httpProvider,$locationProvider,RestangularProvider) {
    // Enable log
    $logProvider.debugEnabled(true);

    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $httpProvider.interceptors.push('authInterceptorService');
    $locationProvider.html5Mode(false);
    // Set options third-party lib
    RestangularProvider.setBaseUrl(
      'http://localhost:65159'
      );

    // set url for login
     }

})();
