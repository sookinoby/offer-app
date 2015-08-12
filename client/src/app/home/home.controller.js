(function() {
  'use strict';

  angular
    .module('client')
    .controller('HomeController', HomeController);

  /** @ngInject */
  function HomeController($window, $rootScope, $auth,$state,UserData,Restangular,exceptionHandler) {
   var vm = this;
   vm.message = "nothing";
  if(2==2) {
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
  }

  }
})();
