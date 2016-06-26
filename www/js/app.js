// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.directives'])

    .run(function($ionicPlatform) {
      $ionicPlatform.ready(function() {
        if(window.StatusBar) {
          StatusBar.styleDefault();
        }
      });
    })
//angular.module('starter', ['ionic', 'ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })


      .state('app.All_AZS', {
        url: '/All_AZS',
        views: {
          'menuContent': {
            templateUrl: 'templates/All_AZS.html'
          }
        }
      })

    .state('app.All_AZS_map', {
      url: '/All_AZS_map',
      views: {
        'menuContent': {
          templateUrl: 'templates/All_AZS_map.html'
        }
      }
    })
          .state('app.About_company', {
            url: '/About_company',
            views: {
              'menuContent': {
                templateUrl: 'templates/About_company.html'
              }
            }
          })
          .state('app.AZS_near', {
            url: '/AZS_near',
            views: {
              'menuContent': {
                templateUrl: 'templates/AZS_near.html'
              }
            }
          })
          .state('app.Build_route', {
            url: '/Build_route',
            views: {
              'menuContent': {
                templateUrl: 'templates/Build_route.html'
              }
            }
          })
          .state('app.Feedback', {
            url: '/Feedback',
            views: {
              'menuContent': {
                templateUrl: 'templates/Feedback.html'
              }
            }
          })
          .state('app.search_history', {
            url: '/search_history',
            views: {
              'menuContent': {
                templateUrl: 'templates/search_history.html'
              }
            }
          })
  // Пример
  .state('app.primer', {
    url: '/primer',
    views: {
      'menuContent': {
        templateUrl: 'templates/primer.html'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/About_company');
});




