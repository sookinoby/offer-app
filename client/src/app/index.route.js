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
        controllerAs: 'mainCtrl',
        authenticate: false
      })
      .state('signup',{
        url:'/signup',
        templateUrl:'app/signup/signup.html',
        controller:'SignUpController',
        controllerAs:'signCtrl',
        authenticate: false
      })
      .state('login',{
        url:'/login',
        templateUrl:'app/login/login.html',
        controller:'LoginController',
        controllerAs: 'loginCtrl',
        authenticate: false
      })
      .state('confirmSignup',{
        url:'/confirmSignup',
        templateUrl:'app/SigupConfirmation/signupconfirm.html',
        authenticate: false
      })
      .state('home',{
        url:'/home',
        templateUrl:'app/secure/home/home.html',
        controller:'HomeController',
        controllerAs: 'homeCtrl',
        authenticate: true
      })
      .state('home.arrowgame',{
        url:'/arrowgame/:type',
        templateUrl:'app/secure/game/arrow/arrow.html',
        controller:'arrowGameController',
        controllerAs: 'arrowCtrl',
        authenticate: true
      })
      .state('home.twominutechallenge',{
        url:'/arrowgame/:type',
        templateUrl:'app/secure/game/arrow/arrow.html',
        controller:'arrowGameController',
        controllerAs: 'arrowCtrl',
        authenticate: true
      })
      .state('home.selectstrategy',{
        url:'/selectstrategy',
        templateUrl:'app/secure/game/strategy/strategy.html',
        controller:'selectStrategyGameController',
        controllerAs: 'strCtrl',
        authenticate:true
      })
      .state('home.threedigit',{
        url:'/threedigit',
        templateUrl:'app/secure/game/threedigit/threedigit.html',
        controller:'ThreeDigitController',
        controllerAs: 'threeCtrl',
        authenticate:true
      })
      .state('home.dashboard',{
        url:'/dashboard',
        templateUrl:'app/secure/dashboard/dashboard.html',
        controller:'DashBoardController',
        controllerAs: 'dashCtrl',
        authenticate:true
      });



   $urlRouterProvider.otherwise('/');
  }

})();
