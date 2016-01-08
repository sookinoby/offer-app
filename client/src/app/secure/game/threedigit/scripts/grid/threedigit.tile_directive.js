(function(){
'use strict';
angular.module('threeDigitGrid')
.directive('tileThreeDigit', function(threeDigitGridService) {
  return {
    restrict: 'A',
    scope: {
      ngModel: '='
    },
    templateUrl: 'app/secure/game/threedigit/scripts/grid/threedigit.tile.html',
    link: function(scope) {
      // Cell generation
      scope.storeAnswer = threeDigitGridService.storeAnswer;
      scope.storeAnswer2 = threeDigitGridService.storeAnswer2;
    }
  };
});
})();
