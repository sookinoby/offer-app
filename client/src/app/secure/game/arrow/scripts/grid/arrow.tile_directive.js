(function() {
'use strict';
angular.module('arrowGameGrid')
.directive('tile1', function(arrowGameService) {
  return {
    restrict: 'A',
    scope: {
      ngModel: '='
    },
    templateUrl: 'app/secure/game/arrow/scripts/grid/arrow.tile.html',
      link: function(scope) {
      // Cell generation
      scope.storeAnswerAndSelectTileForProcessing = arrowGameService.storeAnswerAndSelectTileForProcessing;
    }
  };
});
}());

//selectTitleForProcessing