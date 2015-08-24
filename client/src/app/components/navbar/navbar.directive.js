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
    function NavbarController($window,$auth,userDetailsLocalService) {
      var vm = this;
      vm.loggedIn = false;
      vm.currentUser = null;
      vm.userData = userDetailsLocalService.getUserDetailFromLocal();
     // console.log("outside" + vm.userData.userName);
      if(vm.userData != null)
      {
        vm.loggedIn = true;
        vm.currentUser = vm.userData.userName;
        console.log("inside" + vm.loggedIn);
      }

      vm.logout = function logout()
      {
        console.log("logout");
        vm.loggedIn = false;
        vm.currentUser = null;
        vm.userData = null;
        userDetailsLocalService.deletetUserDetailFromLocal();
        $auth.logout();
       
      }

      // "vm.creation" is avaible by directive option "bindToController: true"
    //  vm.relativeDate = moment(vm.creationDate).fromNow();
    }
  }

})();
