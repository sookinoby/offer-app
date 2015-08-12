(function() {
  'use strict';

  angular
    .module('client')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log,$rootScope,$state,$auth) {

   /*
     $rootScope.$on('$stateChangeStart', function (event, next) {
        if ($auth.isAuthenticated()) {
          if(next.name!='home') {
            event.preventDefault();
            $state.go('home');
          }
        }
    }); */
      $log.debug('runBlock end');
  }

})();
