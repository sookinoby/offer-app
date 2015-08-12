(function() {
  'use strict';

  angular
    .module('client')
    .controller('SignUpController', SignUpController);

     /** @ngInject */
  function SignUpController($auth,$state,UserData,$window) {

     this.signup = function() {
      var user = {
        email: this.email,
        password: this.password
      };
     
      // Satellizer
      $auth.signup(user).then(function(response){
        console.log(response);
        UserData.email = response.data.email;
        $window.localStorage.currentUser = JSON.stringify(response.data.email);
        console.log(response.data);
        $state.go('home');
      })
        .catch(function(response) {
        	console.log("test");
          console.log(response.data);
        });
    };



    }
  

})();