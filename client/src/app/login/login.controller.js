(function() {
  'use strict';

  angular
    .module('client')
    .controller('LoginController', LoginController);

  /** @ngInject */
  function LoginController($window, $rootScope, $auth,$state,UserData,$alert,exceptionHandler) {
     var vm = this;
     this.titleCase = function(str)
     {
        return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
     }

     vm.button_message = "Sign In";
     vm.loggining = false;
     vm.emailLogin = function() {
     vm.loggining = true;
     vm.button_message = "Signing In";
       var user = {
        email: this.email,
        password: this.password
      };

      $auth.login(user)
        .then(function(response) {
         var userName = JSON.parse(JSON.stringify(response.data.userName));
         var userName = vm.titleCase(userName);
          $window.localStorage.currentUser = userName;
          console.log($window.localStorage.currentUser);
          UserData.userName = $window.localStorage.currentUser;
       //   console.log("the data obtained is form cookie storage is");
        //  console.log(JSON.parse($window.localStorage.currentUser));
         // console.log($auth.getToken());
          $state.go('home.dashboard');
         

        })
        .catch(function(response) {
          vm.loggining = false;
          var error = "Something went wrong, Please Try again later";
          if(response.status == 401)
          {
            error = 'Username or Password invalid';
          }
          var jsonDataToshow = {title: error, 
           content: '', placement: 'floater center top', type: 'danger', 
            show: true,
            aninmation:'am-fade-and-slide-top',
            duration:5};
            var myAlert = $alert(jsonDataToshow);
            $state.go('login');
          console.log(response);
        });
    };


  }
})();
