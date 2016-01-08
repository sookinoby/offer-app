(function(){
'use strict';

angular.module('threeDigitGrid')
.directive('gridThreeDigit', function() {
  return {
    restrict: 'A',
    require: 'ngModel',
    scope: {
      ngModel: '='
    },

    templateUrl: 'app/secure/game/threedigit/scripts/grid/threedigit.grid.html',
    link: function(scope) {
      // Cell generation
      scope.grid = scope.ngModel.grid;
      scope.tiles = scope.ngModel.tiles;
    }
  };
});
})();
