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
      });

//    $urlRouterProvider.otherwise('/');
  }

})();
