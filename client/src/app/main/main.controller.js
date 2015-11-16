(function() {
  'use strict';

  angular
    .module('client')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController(Restangular,exceptionHandler,authService,$state) {
  var vm = this;
  if(authService.authentication.isAuth == true)
  {
      if(authService.authentication.roleName == 'Mentor')
      {
        $state.go('home.dashboard');
      }
      else {
        $state.go('home.arrowgame');
      }
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
