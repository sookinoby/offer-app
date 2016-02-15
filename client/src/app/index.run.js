(function() {
  'use strict';

  angular
    .module('client')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log,$rootScope,$state,authService) {
        authService.fillAuthData();

        // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', function (event, toState) {
      $log.debug("starting route changes" );
         // $log.debug(toState.data);
          $log.debug( authService.authentication.roleName);
          if(toState.data && toState.data.needMentor && authService.authentication.roleName === 'Student')
          {
            $state.go("unauthorized");
            event.preventDefault();
          }
          else if (toState.authenticate && !authService.authentication.isAuth) {
                 $log.debug(toState);
                  $log.debug(toState.authenticate);
                 $log.debug('event prevent default trigged');
                 $state.go("login");
                 event.preventDefault();

              }
          });
       $log.debug('runBlock end');
        }

})();
