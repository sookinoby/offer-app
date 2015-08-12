(function() {
  'use strict';

  angular
    .module('client')
    .controller('SignUpController', SignUpController);

     /** @ngInject */
  function SignUpController($auth,$state,UserData,$window,$log) {

     this.signup = function() {
      var user = {
        email: this.email,
        password: this.password
      };
     
      // Satellizer
      $auth.signup(user).then(function(response){
        $log.debug(response);
        UserData.email = response.data.email;
        $window.localStorage.currentUser = JSON.stringify(response.data.email);
        $log.debug(response.data);
        $state.debug('home');
      })
        .catch(function(response) {
        	$log.debug("test");
          $log.debug(response.data);
        });
    };



    }
  

})();