(function() {
  'use strict';

  angular
    .module('client')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log,$rootScope,$state,$auth) {
        // Redirect to login if route requires auth and you're not logged in
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
            if (toState.authenticate && !$auth.isAuthenticated()) {
                 $state.transitionTo("login");
                 event.preventDefault(); 
              }
          });
       $log.debug('runBlock end');
        };
     
})();
