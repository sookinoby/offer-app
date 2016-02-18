(function() {
  'use strict';

  angular
    .module('client')
    .controller('StudentListController', StudentListController);

  /** @ngInject */
  function StudentListController($window, $rootScope, authService,$state,$alert,exceptionHandler,$log,$stateParams) {
     var vm = this;
     vm.n = "hello";
     this.titleCase = function(str)
     {
        return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
     };
     vm.studentList = $stateParams.studentList;
    if(vm.studentList == null)
    {
      vm.studentList = [];
      var student = {
        fullName : "Sooki Booki",
        Age : "24"
      };

      var student1 = {
        fullName : "Sooki Booki 2",
        Age : "25"
      };

      vm.studentList.push(student);
      vm.studentList.push(student1);
    }


    $log.debug(vm.studentList);
     vm.button_message = "Next";
     vm.loggining = false;
     vm.loginData = {};

    vm.setUserName = function(username) {
      vm.username = username;
      $log.debug(username);
    };


     vm.studentLogin = function() {
     vm.loggining = true;
     vm.button_message = "Please Wait";
     vm.loginData.userName = vm.username;
     vm.loginData.password = vm.password;
     authService.login(vm.loginData)
        .then(function(response) {
          vm.loginData.userName = "";
          vm.loginData.password = "";
          vm.loggining = false;
          vm.button_message = "Next";
          $log.debug(response);
          if(authService.authentication.roleName === "Student") {
            $state.go('home.arrowgame');
          }
       })
        .catch(function(response) {
          vm.loggining = false;
          vm.button_message = "Next";
          var error_description = "Something went wrong, Please Try again later";
          if(response !== null )
          {
            error_description = response.error_description;
          }
          var jsonDataToshow = {title: error_description ,
           content: '', placement: 'floater center top', type: 'danger',
            show: true,
            aninmation:'am-fade-and-slide-top',
            duration:5};
            $alert(jsonDataToshow);
            $state.go('login.list');
          $log.debug(response);
        });
    };


  }
})();
