/* global L */
'use strict';
angular.module('Seminarium.controllers', ['Seminarium.services'])

.controller('ArriveCtrl', function($scope, SearchService, Sync) {
  $scope.progress = 0;
  var getNearest = function(){
    console.log('getNearest');
    SearchService.getNearestBusstops(function(busstops){
      $scope.busstops = busstops;
      $scope.asyncDone = true;
      $scope.$apply();
    });
  };
  SearchService.isLoaded({
    onSuccess : function(){
      getNearest();
    },
    onError : function(table){
      Sync.onDone = function(){
        $scope.progress = 0;
        getNearest();
      };
      Sync.onProgress = function(progress){
        $scope.progress = progress;
      };
      Sync.run();
    }
  });
  
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
      }
    ];
    $scope.details = function(id){
      window.location.hash='#/tab/data/'+id;
    };

    $scope.asyncDone = true;
  }, 1);
})
      

.controller('DataDetailsCtrl', function($scope, Sync) {
  setTimeout(function(){
    $scope.data = {
      id: 1,
      name : 'Rozkład ZTM Gdańsk',
      description: 'Zawiera pozycje przystanków, numery tramwajów i autobusów ZTM Gdańsk',
      updatedAt: '2014.01.14'
    };
    $scope.onDeleteClick = function(){
      Sync.onDone = function(){
        $scope.progress = 0;
      };
      Sync.onProgress = function(progress){
        $scope.progress = progress;
      };
      Sync.run();
    };      
    $scope.asyncDone = true;
  }, 1);
})
;
