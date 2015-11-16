(function() {
  'use strict';

  angular
    .module('client')
    .directive('acmeNavbar', acmeNavbar);

  /** @ngInject */
  function acmeNavbar() {
    var directive = {
      restrict: 'EA',
      templateUrl: 'app/components/navbar/navbar.html',
      scope: {
          creationDate: '='
      },
      controller: NavbarController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function NavbarController($window,authService,$scope) {
      var vm = this;


   //   console.log("outside" + vm.loggedIn );
      vm.loggedIn = false;
      if(authService.authentication.isAuth)
      {
        vm.loggedIn = true;
      //  console.log("Inside the if statment" + vm.loggedIn);
        vm.currentUser = authService.authentication.fullName;

      }

      vm.logout = function()
      {
   //     console.log("logout");

        vm.loggedIn = false;
    //    console.log("logging out" + vm.loggedIn );

        vm.currentUser = null;
        vm.loggedIn = false;
        authService.logOut();

      }

      // "vm.creation" is avaible by directive option "bindToController: true"
    //  vm.relativeDate = moment(vm.creationDate).fromNow();
    }
  }

})();
