(function() {
  'use strict';

  angular
    .module('client')
    .controller('LoginController', LoginController);

  /** @ngInject */
  function LoginController($window, $rootScope, authService,$state,$alert,exceptionHandler,$log) {
     var vm = this;
  }
})();
