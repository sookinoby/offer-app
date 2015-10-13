(function() {
  'use strict';

  angular
    .module('client')
    .controller('sigupconfirmController', sigupconfirmController);

  /** @ngInject */
  function sigupconfirmController(Restangular,UserData,$state,exceptionHandler) {
  var vm = this;
  this.message = "sooki";

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
