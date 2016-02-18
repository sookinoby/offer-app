(function() {
  'use strict';

  angular
    .module('client')
    .controller('DashBoardController', DashBoardController);

  /** @ngInject */
  function DashBoardController($window,$state,authService,Restangular,exceptionHandler,$scope,$modal,$log,$alert,moment) {
   var vm = this;
   vm.message = "Welcome " + authService.authentication.userName;
   vm.secondMessage = "You are logged in as " + authService.authentication.roleName;
   var addStudentModal = $modal({scope: $scope, templateUrl: 'app/secure/dashboard/studentregistration.html', show: false});
    var vm = this;
    this.account = "Add Student";
    this.creating = false;
    this.refreshing = false;
    $scope.updated = false;
    this.dateTest = moment(this.dob);
    this.listOfStudents = [];
    var User = Restangular.all('accounts');
    var currentMentor = User.one('mentor',authService.authentication.mentoruid);
    this.gridOptions = {};
    this.defaultPasswordAdded = null;
    this.savePassword = function()
    {
        vm.defaultPasswordAdded = this.defaultPassword;
        vm.password = vm.defaultPasswordAdded;
        vm.confirmPassword = vm.defaultPasswordAdded;
        var jsonDataToshow = {title: "Default Password Set",
        content: '', placement: 'floater center top', type: 'success',
        show: true,
        aninmation:'am-fade-and-slide-top',
        duration:5};
        $alert(jsonDataToshow);

    }


    this.populateData = function () {
      vm.refreshing = true;
      currentMentor.getList('students').then(function (resourceList) {
        var responseList = resourceList.plain();
        $log.debug(responseList);
        vm.listOfStudents = [];
        var index = 1;
        responseList.forEach(function (entry) {
          entry.dateOfBirth = moment(entry.dateOfBirth).format("Do MMM YYYY");
          entry.joinDate = moment(entry.joinDate).format("Do MMM YYYY");
          var student = {
            "index": index,
            "dateOfBirth": entry.dateOfBirth,
            "fullName": entry.fullName,
            "joinDate": entry.joinDate,
            "id": entry.id

          }
          vm.listOfStudents.push(student);
          index++;
        })
        vm.refreshing = false;
        vm.updateGrid();
      });
    };

    this.updateGrid = function() {
      this.gridOptions = {
        enableSorting: true,
        columnDefs: [
          {name: 'ID', field: 'index'},
          {name: 'Full Name', field: 'fullName'},
          {name: 'Date Of Birth', field: 'dateOfBirth'},
          {name: 'Join Date', field: 'joinDate', enableCellEdit: false}
        ],
        data: vm.listOfStudents
      }
    };

    vm.showModal = function() {
      addStudentModal.$promise.then(addStudentModal.show);
    };

    vm.hideModal = function() {
      addStudentModal.$promise.then(addStudentModal.hide);
    };


    this.signupStudent = function() {
      vm.creating = true;
      vm.account = "Adding Student";
      var user = {
        fullName: this.fullname,
        password: this.password,
        confirmPassword : this.confirmPassword,
        RoleName : "Student",
        dateOfBirth : moment(this.dob),
        referenceMentor :authService.authentication.mentoruid
      };


      authService.saveRegistrationForStudent(user).then(function(response){
        vm.fullname = '';
        vm.password = '';
        vm.confirmPassword = '';
        if( vm.defaultPasswordAdded != null )
        {
          vm.password = vm.defaultPasswordAdded;
          vm.confirmPassword = vm.defaultPasswordAdded;
        }

        vm.dateOfBirth = moment;

      $log.debug(response);
      $log.debug(response.data);
        vm.account = "Add Student";
        $scope.updated = true;
        vm.creating = false;
        vm.hideModal();
      })
        .catch(function(response) {
          //	$log.debug("test" + response.status);
          vm.creating = false;
          vm.account = "Add Student";
          var error = "Something went wrong, Please Try again later";
          vm.hideModal();
          if(response.status == 409)
          {
            error = 'Email Already taken'
          }
          var jsonDataToshow = {title: error,
            content: '', placement: 'floater center top', type: 'danger',
            show: true,
            aninmation:'am-fade-and-slide-top',
            duration:5};
          $alert(jsonDataToshow);
          $log.debug(response.data);
        });
    };


    $scope.$watch('updated', function() {
      vm.refreshing = true;
      vm.populateData();
    });

    /* if(2==2) {
       var messageList = Restangular.all('api/secure');
       var mess = messageList.getList().then(function(data){
       vm.message = data;
     },function(err) {
     console.log("test");
     console.log(err); // Error: "It broke"
     });

     }
     else {
       $state.go("login");
     } */

  }
})();
