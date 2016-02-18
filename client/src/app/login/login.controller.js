(function() {
  'use strict';

  angular
    .module('client')
    .controller('LoginController', LoginController);

  /** @ngInject */
  function LoginController( $rootScope, authService,$state,$alert,exceptionHandler,$log) {
     var vm = this;
  }
})();
