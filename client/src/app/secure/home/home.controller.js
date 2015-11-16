(function() {
  'use strict';

  angular
    .module('client')
    .controller('HomeController', HomeController);

  /** @ngInject */
  function HomeController($window, $rootScope,$state,Restangular,exceptionHandler,authService) {
   var vm = this;
   vm.message = "Welcome " + authService.authentication.userName;


  }
})();
