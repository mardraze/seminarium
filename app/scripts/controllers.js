'use strict';
angular.module('Seminarium.controllers', ['Seminarium.services'])

.controller('ArriveCtrl', function($scope, SearchService) {
  SearchService.test();
  setTimeout(function(){
    $scope.busstops = [
      {
        title: 'Traugutta-Sobieskiego',
        vehicles : [
          {
            'name' : '199',
            'time' : 'za 1 minutę'
          }
        ]
      },
      {
        title: 'Miszewskiego',
        vehicles : [
          {
            'name' : '11',
            'time' : 'za 9 minut'
          }
        ]
      }
    ];

    $scope.asyncDone = true;
  }, 1);
})

.controller('MapCtrl', function($scope) {
  setTimeout(function(){
    $scope.userPosition = {
      lat : 54,
      lng : 14
    };
    $scope.zoom = 8;
    $scope.list = [
      {
        id: 1,
        position : {
          lat : 54.045,
          lng : 14.045
        },
        route : [
          {
            lat : 54.045,
            lng : 14.045
          },
          {
            lat : 54.045,
            lng : 14.045
          },
          {
            lat : 54.045,
            lng : 14.045
          }
        ]
      },
      {
        id: 2,
        position : {
          lat : 54.023,
          lng : 14.023
        },
        route : [
          {
            lat : 54.045,
            lng : 14.045
          },
          {
            lat : 54.045,
            lng : 14.045
          },
          {
            lat : 54.045,
            lng : 14.045
          }
        ]
      },
    ];

    $scope.asyncDone = true;
  }, 1);
})

.controller('SearchCtrl', function($scope) {
  $scope.run = true;
  $scope.onKeyUp = function(value){
    if(value){
      try{
        
      }catch(e){
      }
    }
    return [];
  };
})

.controller('FavoritesCtrl', function($scope) {
  setTimeout(function(){
    $scope.favorites = [
      {
        group : 'Przystanki',
        elements : [
          {
            'name' : 'Traugutta-Sobieskiego',
            'sort' : 2
          },
          {
            'name' : 'Miszewskiego',
            'sort' : 1
          },

        ]
      },
      {
        group : 'Pojazdy',
        elements : [
          {
            'name' : 'Autobus 199',
            'sort' : 2
          },
          {
            'name' : 'Tramwaj 11',
            'sort' : 1
          },
        ]
      }
    ];
    $scope.asyncDone = true;
  }, 1);
})

.controller('DataCtrl', function($scope) {
  setTimeout(function(){
    $scope.list = [
      {
        id: 1,
        label : 'Rozkład ZTM Gdańsk',
        description: 'Zawiera pozycje przystanków, numery tramwajów i autobusów ZTM Gdańsk',
        updatedAt: '2014.01.14'
      },
      {
        id: 2,
        label : 'PKP na trasie Gdańsk-Olsztyn',
        description: 'Zawiera pozycje przystanków oraz pociągi na trasie Gdańsk-Olsztyn',
        updatedAt: '2014.05.07'
      },
    ];
    $scope.asyncDone = true;
  }, 1);
})
;
