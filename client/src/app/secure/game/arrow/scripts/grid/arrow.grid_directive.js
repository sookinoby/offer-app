(function() {
'use strict';

angular.module('arrowGameGrid')
.directive('arrowGrid', function() {
  return {
    restrict: 'A',
    require: 'ngModel',
    scope: {
      ngModel: '='
    },
    templateUrl: 'app/secure/game/arrow/scripts/grid/arrow.grid.html',
    link: function(scope) {
      // Cell generation
      //  console.log(scope)
      scope.grid = scope.ngModel.grid;
      scope.tiles = scope.ngModel.tiles;

    }
  };
});
}());
