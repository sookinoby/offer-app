(function() {
  'use strict';

  angular
    .module('client')
    .controller('SignUpController', SignUpController);

     /** @ngInject */
  function SignUpController(authService,$state,$window,$log,$alert,exceptionHandler) {
     var vm = this;
     this.account = "Create Account";
     this.creating = false;
     this.signup = function() {
      vm.creating = true;
      vm.account = "Create Account";

      var user = {
        email: this.email,
        password: this.password,
        confirmPassword : this.confirmPassword,
        userName: this.username,
        fullName: this.fullname,
        country: this.country,
        phone: this.phone,
        RoleName : "Mentor",
        MentorType : this.mentorType,
        Country :  this.country
      };
      // Satellizer
       authService.saveRegistration(user).then(function(response){

        $log.debug(response);
        $log.debug(response.data);
        $state.go('confirmSignup');
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

           $state.go('signup');
          $log.debug(response.data);
        });
    };



    }


})();
