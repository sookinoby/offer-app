(function() {
  'use strict';

  angular
    .module('client')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController(Restangular,UserData,$state,exceptionHandler,$auth) {
  var vm = this;
  this.message = "sooki";
  if($auth.isAuthenticated())
  {
    $state.go("home.dashboard");
  }
 /*
  var messageList = Restangular.all('api/unsecure');
  var mess = messageList.getList().then(function(data){
    vm.message = data;
  },function(err) {
  console.log("Error"); 
  console.log(err); // Error: "It broke"
  });
  if( UserData && UserData.email && UserData.email != null && UserData.email != "" ) {
    $state.go("home"); 
    console.log(UserData.email);
  } */
 

  }


})();
