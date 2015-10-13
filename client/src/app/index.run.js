(function() {
  'use strict';

  angular
    .module('client')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log,$rootScope,$state,authService,UserData) {
        authService.fillAuthData();
        UserData.userName = authService.authentication.userName;
        // Redirect to login if route requires auth and you're not logged in
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
          $log.debug("starting route changes" );
          $log.debug(toState);
            if (toState.authenticate && !authService.authentication.isAuth) {
                 $log.debug(toState);
                  $log.debug(toState.authenticate);
                 $log.debug('event prevent default trigged');
                 $state.go("login");
                 event.preventDefault();

              }
          });
       $log.debug('runBlock end');
        };

})();
