(function() {
  'use strict';

  angular
    .module('client')
    .controller('MentorLoginController', MentorLoginController);

  /** @ngInject */
  function MentorLoginController($window, $rootScope, authService,$state,$alert,exceptionHandler,$log) {
     var vm = this;
     this.titleCase = function(str)
     {
        return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
     }

     vm.button_message = "Sign In";
     vm.loggining = false;
     vm.loginData = {};
     vm.login = function() {
     vm.loggining = true;
     vm.button_message = "Signing In";
     vm.loginData.userName = vm.username;
     vm.loginData.password = vm.password;
     authService.login(vm.loginData)
        .then(function(response) {
          vm.loginData.userName = "";
          vm.loginData.password = "";
          vm.loggining = false;
          vm.button_message = "Sign In";
          $log.debug(response);
          if(authService.authentication.roleName == "Mentor") {
            $state.go('home.dashboard');
          }
       })
        .catch(function(response) {
          vm.loggining = false;
          vm.button_message = "Sign In";
          var error_description = "Something went wrong, Please Try again later";
          if(response !=null )
          {
            error_description = response.error_description;
          }
          var jsonDataToshow = {title: error_description ,
           content: '', placement: 'floater center top', type: 'danger',
            show: true,
            aninmation:'am-fade-and-slide-top',
            duration:5};
            var myAlert = $alert(jsonDataToshow);
            $state.go('login.mentor');
          $log.debug(response);
        });
    };


  }
})();
