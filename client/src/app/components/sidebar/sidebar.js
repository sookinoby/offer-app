(function() {
  'use strict';

  angular
    .module('client')
    .directive('sideNavbar', sideNavbar);

  /** @ngInject */
  function sideNavbar() {
    var directive = {
      restrict: 'EA',
      templateUrl: 'app/components/sidebar/sidebar.html',
      scope: {
          creationDate: '='
      },
      controller: sideNavbarController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function sideNavbarController() {
      var vm = this;

      // "vm.creation" is avaible by directive option "bindToController: true"
    //  vm.relativeDate = moment(vm.creationDate).fromNow();
    }
  }

})();
