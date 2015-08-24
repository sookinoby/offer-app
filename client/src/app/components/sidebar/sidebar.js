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
      this.shouldShowSideBar = true;
      this.showSideBar = function showSideBar()
      {
        this.shouldShowSideBar = true;
        console.log(this.shouldShowSideBar);
      }
       this.hideSideBar = function hideSideBar()
      {
        this.shouldShowSideBar = false;
      }
      // "vm.creation" is avaible by directive option "bindToController: true"
    //  vm.relativeDate = moment(vm.creationDate).fromNow();
    }
  }

})();
