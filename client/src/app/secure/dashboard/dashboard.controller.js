(function() {
  'use strict';

  angular
    .module('client')
    .controller('DashBoardController', DashBoardController);

  /** @ngInject */
  function DashBoardController($window, $rootScope, $auth,$state,UserData,Restangular,exceptionHandler,userDetailsLocalService) {
   var vm = this;
   vm.message = "Welcome " + userDetailsLocalService.getUserDetailFromLocal().userName;
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
