(function(){
'use strict';
angular.module('selectStrategyGrid')
.directive('tileSelectStrategy', function(SelectStrategyGridService) {
  return {
    restrict: 'A',
    scope: {
      ngModel: '='
    },
    templateUrl: 'app/secure/game/strategy/scripts/grid/selectstrategy.tile.html',
    link: function(scope) {
      // Cell generation
      scope.storeAnswer = SelectStrategyGridService.storeAnswer;
    }
  };
});
})();