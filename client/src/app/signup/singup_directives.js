(function() {
  'use strict';
angular.module('client')
  .directive('repeatPassword', function() {
    return {
      require: 'ngModel',
      link: function(scope, elem, attrs, ctrl,exceptionHandler) {
        var otherInput = elem.inheritedData("$formController")[attrs.repeatPassword];

        ctrl.$parsers.push(function(value) {
          if (value === otherInput.$viewValue) {
            ctrl.$setValidity('repeat', true);
            return value;
          }
          ctrl.$setValidity('repeat', false);
        });

        otherInput.$parsers.push(function(value) {
          ctrl.$setValidity('repeat', value === ctrl.$viewValue);
          return value;
        });
      }
    };
  })
  .directive('emailUnique', function ($http,isEmailAvailable) {
  return {
    require: 'ngModel',
    link: function (scope, elem, attrs,ctrl) {
      ctrl.$asyncValidators.unique = isEmailAvailable;
      }
    }
  })
  .directive('userNameUnique', function ($http,userNameService) {
  return {
    require: 'ngModel',
    link: function (scope, elem, attrs,ctrl) {
      ctrl.$asyncValidators.unique = userNameService;
    }
  }
});
})();



