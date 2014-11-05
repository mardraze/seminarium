/* global L */
'use strict';
angular.module('Seminarium.controllers', ['Seminarium.services'])

.controller('ArriveCtrl', function($scope, SearchService) {
  setTimeout(function(){
    SearchService.test();
    $scope.busstops = [
      {
        name: 'Traugutta-Sobieskiego',
        vehicles : [
          {
            'name' : '199',
            'time' : 'za 1 minutę'
          }
        ]
      },
      {
        name: 'Miszewskiego',
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
      lat : 54.372,
      lng : 18.616
    };
    $scope.zoom = 15;
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
    if($scope.testing === undefined){
      L.marker($scope.userPosition).addTo(map)
        .bindPopup('Moja pozycja')
        .openPopup();
    }
    
    $scope.asyncDone = true;
  }, 1);
  if($scope.testing === undefined){
    var map = L.map('map').setView([54.370, 18.616], 15);

    L.tileLayer( 'images/seminarium_atlas/MapQuest/{z}/{x}/{y}.jpg', {
        maxZoom: 15,
        minZoom: 9
      })
      .addTo(map);
        
  }

})

.controller('SearchCtrl', function($scope) {
  $scope.run = true;
  var data = {
    'search' : 'asd',
    'result' : [
      'asdasd'
    ]
  };
  $scope.data = data;
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
        name : 'Przystanki',
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
        name : 'Pojazdy',
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
        name : 'Rozkład ZTM Gdańsk',
        description: 'Zawiera pozycje przystanków, numery tramwajów i autobusów ZTM Gdańsk',
        updatedAt: '2014.01.14'
      },
      {
        id: 2,
        name : 'PKP na trasie Gdańsk-Olsztyn',
        description: 'Zawiera pozycje przystanków oraz pociągi na trasie Gdańsk-Olsztyn',
        updatedAt: '2014.05.07'
      },
    ];
    $scope.details = function(id){
      window.location.hash='#/tab/data/'+id;
    };
    $scope.asyncDone = true;
  }, 1);
})
      

.controller('DataDetailsCtrl', function($scope) {
  setTimeout(function(){
    $scope.data = {
      id: 1,
      name : 'Rozkład ZTM Gdańsk',
      description: 'Zawiera pozycje przystanków, numery tramwajów i autobusów ZTM Gdańsk',
      updatedAt: '2014.01.14'
    };
    $scope.asyncDone = true;
  }, 1);
})
;
