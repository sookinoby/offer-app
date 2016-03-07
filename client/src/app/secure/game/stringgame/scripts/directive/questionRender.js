// Setup the filter
(function(){
  'use strict';
angular.module('stringGameCommonService').directive('questionDisplay',  function($timeout) {
    return {
      restrict: 'EA',
      require: 'ngModel',
      scope: {
        test : '@',
        myName : '=',
        ngModel : '='
      },
      template: "{{ngModel}}",
      link: function(scope, element, attrs, ngModel) {
        scope.myName = scope.test;
      }
    };
  }
);
})();
