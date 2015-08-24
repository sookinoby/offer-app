(function() {
  'use strict';

  angular
    .module('client')
    .controller('HomeController', HomeController);

  /** @ngInject */
  function HomeController($window, $rootScope, $auth,$state,UserData,Restangular,exceptionHandler,userDetailsLocalService) {
   var vm = this;
   vm.message = "Welcome " + userDetailsLocalService.getUserDetailFromLocal().userName;


  }
})();
