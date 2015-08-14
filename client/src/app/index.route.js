(function() {
  'use strict';

  angular
    .module('client')
    .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('index', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainController',
        controllerAs: 'mainCtrl'
      })
      .state('signup',{
        url:'/signup',
        templateUrl:'app/signup/signup.html',
        controller:'SignUpController',
        controllerAs:'signCtrl'
      })
      .state('login',{
        url:'/login',
        templateUrl:'app/login/login.html',
        controller:'LoginController',
        controllerAs: 'loginCtrl'
      })
      .state('home',{
        url:'/home',
        templateUrl:'app/home/home.html',
        controller:'HomeController',
        controllerAs: 'homeCtrl'
      })
      .state('home.arrowgame',{
        url:'/arrowgame',
        templateUrl:'app/game/arrow/arrow.html',
        controller:'ArrowController',
        controllerAs: 'arrowCtrl'
      })
      .state('home.selectstrategy',{
        url:'/selectstrategy',
        templateUrl:'app/game/statergy/strategy.html',
        controller:'StrategyController',
        controllerAs: 'strCtrl'
      })
      .state('home.threedigit',{
        url:'/threedigit',
        templateUrl:'app/game/threedigit/threedigit.html',
        controller:'ThreeDigitController',
        controllerAs: 'threeCtrl'
      });

   

   $urlRouterProvider.otherwise('/');
  }

})();
