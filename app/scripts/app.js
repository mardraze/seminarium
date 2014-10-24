'use strict';

angular.module('Seminarium', ['ionic', 'Seminarium.controllers'])


//    console.log(window.performance.getEntriesByType("resourceError"));

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)

    var hasPlugin = function(pluginName){
      return window.hasOwnProperty('cordova') && window.cordova.hasOwnProperty('plugins') && window.cordova.plugins.hasOwnProperty(pluginName);
    };
    if(hasPlugin('Keyboard')) {
      window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.hasOwnProperty('StatusBar')) {
      // org.apache.cordova.statusbar required
      window.StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    // setup an abstract state for the tabs directive
    .state('tab', {
      url: '/tab',
      abstract: true,
      templateUrl: 'templates/tabs.html'
    })
    .state('action', {
      url: '/action',
      views: {
        'action': {
          controller: 'ActionCtrl'
        }
      }
    })
  
    .state('tab.arrive', {
      url: '/arrive',
      views: {
        'arrive-tab': {
          templateUrl: 'templates/arrive.html',
          controller: 'ArriveCtrl'
        }
      }
    })

    .state('tab.search', {
      url: '/search',
      views: {
        'search-tab': {
          templateUrl: 'templates/search.html',
          controller: 'SearchCtrl'
        }
      }
    })
    .state('tab.favorites', {
      url: '/favorites',
      views: {
        'favorites-tab': {
          templateUrl: 'templates/favorites.html',
          controller: 'FavoritesCtrl'
        }
      }
    })

    .state('tab.map', {
      url: '/map',
      views: {
        'map-tab': {
          templateUrl: 'templates/map.html',
          controller: 'MapCtrl'
        }
      }
    })
    .state('tab.data', {
      url: '/data',
      views: {
        'data-tab': {
          templateUrl: 'templates/data.html',
          controller: 'DataCtrl'
        }
      }
    })
    .state('tab.data_id', {
      url: '/data/:id',
      views: {
        'data-tab': {
          templateUrl: 'templates/dataDetails.html',
          controller: 'DataDetailsCtrl'
        }
      }
    })
    .state('tab.about', {
      url: '/about',
      views: {
        'about-tab': {
          templateUrl: 'templates/about.html'
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/arrive');

});

