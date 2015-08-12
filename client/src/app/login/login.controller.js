(function() {
  'use strict';

  angular
    .module('client')
    .controller('LoginController', LoginController);

  /** @ngInject */
  function LoginController($window, $rootScope, $auth,$state,UserData) {
      var vm = this;
      
      this.emailLogin = function() {
       var user = {
        email: this.email,
        password: this.password
      };
      $auth.login(user)
        .then(function(response) {

          $window.localStorage.currentUser = JSON.stringify(response.data.email);
          console.log("the data obtained is form cookie storage is");
          console.log(JSON.parse($window.localStorage.currentUser));
          console.log($auth.getToken());
          $state.go('home');
         

        })
        .catch(function(response) {
          vm.errorMessage = {};
          console.log(response);
        });
    };


  }
})();
