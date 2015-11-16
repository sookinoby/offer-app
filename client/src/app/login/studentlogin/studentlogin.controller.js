(function() {
  'use strict';

  angular
    .module('client')
    .controller('StudentLoginController', StudentLoginController);

  /** @ngInject */
  function StudentLoginController($window, $rootScope, authService,$state,$alert,exceptionHandler,$log) {
     var vm = this;
     this.titleCase = function(str)
     {
        return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
     }

     vm.button_message = "Next";
     vm.loggining = false;
     vm.loginData = {};

     vm.studentList = function() {
     vm.loggining = true;
     vm.button_message = "Please Wait";
     vm.loginData.userName = vm.username;
     authService.getStudentForMentor(vm.loginData.userName)
        .then(function(response) {
          vm.loginData.userName = "";
          vm.loggining = false;
          vm.button_message = "Next";
          $log.debug(response.data);
          $state.go('login.list',{ studentList : response.data});

       })
        .catch(function(response) {
          vm.loggining = false;
          vm.button_message = "Next";
          var error_description = "Something went wrong, Please Try again later";
          if(response !=null && response.statusText.localeCompare('404'))
          {
            error_description = "Sorry mentor user name not found. Please contact your teacher";
          }
          var jsonDataToshow = {title: error_description ,
           content: '', placement: 'floater center top', type: 'danger',
            show: true,
            aninmation:'am-fade-and-slide-top',
            duration:5};
            var myAlert = $alert(jsonDataToshow);
            $state.go('login.student');
          $log.debug(response);
        });
    };


  }
})();
