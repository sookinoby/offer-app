(function() {
  'use strict';

  angular
    .module('client')
    .config(config);

  /** @ngInject */
  /* */
  function config($logProvider,$httpProvider,$locationProvider,RestangularProvider,CONSTANT_DATA) {
    // Enable log
    //"http://localhost:65159/api/accounts/checkusername/";
    $logProvider.debugEnabled(true);

    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $httpProvider.interceptors.push('authInterceptorService');
    $locationProvider.html5Mode(false);
    // Set options third-party lib
    RestangularProvider.setDefaultHeaders(
      {'Content-Type': 'application/json'}
      );
  //  var baseService = 'http://localhost:65159/api/';

    RestangularProvider.setBaseUrl(
      CONSTANT_DATA.base_url
    );
    //http://r2mworks.azurewebsites.net/api/
    // http://localhost:65159/api/
    // set url for login
     }

})();
