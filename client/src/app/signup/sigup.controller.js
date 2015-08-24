(function() {
  'use strict';

  angular
    .module('client')
    .controller('SignUpController', SignUpController);

     /** @ngInject */
  function SignUpController($auth,$state,UserData,$window,$log,$alert,exceptionHandler) {
     var vm = this;
     this.account = "Create Account";
     this.creating = false;
     this.signup = function() {
      vm.creating = true;
      vm.account = "Create Account";
      var user = {
        email: this.email,
        password: this.password,
        userName: this.username
      };
      // Satellizer
      $auth.signup(user).then(function(response){
   
        $log.debug(response);
        UserData.email = response.data.email;
        $window.localStorage.currentUser = JSON.stringify(response.data.email);
        $log.debug(response.data);
        $state.go('home');
      })
        .catch(function(response) {
        //	$log.debug("test" + response.status);
          vm.creating = false;
          var error = "Something went wrong, Please Try again later";
          if(response.status == 409)
          {
            error = 'Email Already taken'
          }


          var jsonDataToshow = {title: error, 
           content: '', placement: 'floater center top', type: 'danger', 
            show: true,
            aninmation:'am-fade-and-slide-top',
            duration:5};
            var myAlert = $alert(jsonDataToshow);
           

          $log.debug(response.data);
        });
    };



    }
  

})();