/* global L */
'use strict';
angular.module('Seminarium.controllers', ['Seminarium.services'])

.controller('ArriveCtrl', function($scope, SearchService, ConfigService, Sync) {
  console.log('ArriveCtrl Start');
  $scope.progress = 0;
  var getNearest = function(){
    console.log('getNearest');
    SearchService.getNearestBusstops(function(busstops){
      var str = JSON.stringify(Sync.fromObject);
      var length = str.length;
      var i=0;
      var offset = 1024;

      var request = function(url, success){
        var req = new XMLHttpRequest();
        req.open('GET', url, true); 
        req.onreadystatechange = function (aEvt) {
          if (req.readyState == 4) {
            success();
          }
        };
        req.send(null);
      };
      
      var writePost = function(){
        if(i == 0){
          request('http://localhost/test/test/js-big/data.php?clean=1', writePost);
        }else{
          if(offset*i < length){
            request('http://localhost/test/test/js-big/data.php?data='+str.substr((i-1)*offset, i*offset), writePost);
            console.log((offset*i)+' / '+length);
          }else{
            console.log('Koniec!');
          }
          
        }
        i++;
      };
      writePost();
      $scope.busstops = busstops;
      $scope.asyncDone = true;
      $scope.$apply();
    });
  };
  
  SearchService.isLoaded({
    onSuccess : function(){
      console.log('isLoaded onSuccess');
      getNearest();
    },
    onError : function(table){
      console.log('isLoaded onError');
      Sync.onDone = function(){
        console.log('Sync.onDone');
        $scope.progress = 0;
        $scope.$apply();
        getNearest();
      };
      Sync.onProgress = function(progress){
        console.log('Sync.onProgress '+progress);
        $scope.progress = progress;
      };
      Sync.onError = function(){
        $scope.gotoData = function(){
          window.location.hash='#/tab/data';
        };
        $scope.error = true;
        $scope.$apply();
      };
      
      Sync.run();
    }
  });
  
})

.controller('MapCtrl', function($scope, UserPosition, SearchService) {
  var map = L.map('map').setView([54.370, 18.616], 15);

  L.tileLayer( 'images/seminarium_atlas/MapQuest/{z}/{x}/{y}.jpg', {
    maxZoom: 15,
    minZoom: 9
  })
  .addTo(map);

  UserPosition.get(function(lat, lng){
    $scope.userPosition = {
      lat : lat,
      lng : lng
    };
    $scope.$apply();
    L.marker($scope.userPosition).addTo(map)
      .bindPopup('Moja pozycja')
      .openPopup();
  });
  $scope.zoom = 15;
  SearchService.getNearestBusstops(function(busstops){
    if(busstops){
      for(var i=0; i<busstops.length && i < 10; i++){
        L.marker($scope.userPosition).addTo(map)
          .bindPopup(busstops[i].name)
          .openPopup();
      }
    }
    
  });

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
          }
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
          }
        ]
      }
    ];
    $scope.asyncDone = true;
  }, 1);
})

.controller('DataCtrl', function($scope, ChooseFile) {
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
  $scope.popupOnChoose = function(path){
    window.resolveLocalFileSystemURL(path, function(entry){
      entry.file(function(file) {
          var reader = new FileReader();
          reader.onloadend = function (evt) {
              console.log("read success");
              console.log(evt.target.result);
          };
          var content = reader.readAsText(file);
        console.log(content);
      }, function (error) {
          console.log(error.code);
      });
    });
  };
})
.directive('chooseFile', function($ionicPopup, $timeout) {
  return {
    controller: function($scope) {
      $scope.popupContent = 'r';
      $scope.popupButtonTitle = 'Wybierz plik';
      $scope.popupCancel = 'Anuluj';
      $scope.popupSave = 'Wybierz';
      $scope.popupResult = '';
      $scope.popupUpDir = 'Do góry';
      $scope.popupTitle = 'Wybierz plik';
      $scope.popupRoot = window.cordova ? window.cordova.file.externalRootDirectory : 'file:///';
      $scope.parentDir = null;
      $scope.popupChooseEntry = function(entry){
        if(entry){
          if(entry.isDirectory){
            entry.getParent(function(parentDir){
              $scope.parentDir = parentDir;
            }, function(){
              $scope.parentDir = null;
            });
            $scope.popupResult = '';
            FileManager.getEntries(entry, function(entries){
              $scope.popupEntries = entries;
            });
          }else{
            $scope.popupResult = entry.fullPath;
          }
        }else{
          console.log('Entry not defined');
        }
      };
      $scope.popupOnChoose = function(){
        console.log('CHOOSEN FILE PATH "'+$scope.popupResult+'"');
        window.resolveLocalFileSystemURL($scope.popupRoot+$scope.popupResult, function(entry){
          entry.file(function(file) {
              var reader = new FileReader();
              reader.onloadend = function (evt) {
                  console.log("read success");
                  console.log(evt.target.result);
              };
              var content = reader.readAsText(file);
            console.log(content);
          }, function (error) {
              console.log(error.code);
          });
        });

      };
      $scope.popupOnCancel = function(){
        console.log('CANCELLED');
      };
      $scope.popupOnClose = function(res){
        console.log('CLOSED');
      };
      $scope.popupShowPopup = function(){
        $scope.popupEntries = [];
        FileManager.getRoot(function(rootDir){
          FileManager.getEntries(rootDir, function(entries){
            $scope.popupEntries = entries;
            var myPopup = $ionicPopup.show({
              templateUrl: 'templates/directive/chooseFilePopup.html',
              title: $scope.popupTitle,
              subTitle: $scope.popupSubTitle,
              scope: $scope,
              buttons: [
                { 
                  text: $scope.popupCancel,
                  onTap: function(e) {
                    $scope.popupResult = '';
                    $scope.popupOnCancel();
                  }
                },
                {
                  text: '<b>'+$scope.popupSave+'</b>',
                  type: 'button-positive',
                  onTap: function(e) {
                    if ($scope.popupResult) {
                      return $scope.popupResult;
                    } else {
                      e.preventDefault();
                    }
                  }
                }
              ]
            });
            myPopup.then($scope.popupOnChoose);
            
          });
        });
        

      };
      console.log('window.innerHeight='+window.innerHeight);
      var FileManager = {
        getRoot : function(onGetRoot){		
          console.log('getRoot');
          
          window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
          window.requestFileSystem(window.PERSISTENT, 0, function(fileSystem) {
            console.log('onGetRoot root='+ $scope.popupRoot);
            window.resolveLocalFileSystemURL = window.resolveLocalFileSystemURL || window.webkitResolveLocalFileSystemURL;
            window.resolveLocalFileSystemURL($scope.popupRoot, onGetRoot, FileManager.error);
          }, FileManager.error);
          
		},
  		getEntries : function (dirEntry, onDone){
          console.log('getEntries');
          if (dirEntry == null){
            console.log('dirEntry is null');
            onDone([]);
          }else if(!dirEntry.isDirectory){
            console.log('dirEntry is not directory');
            onDone([]);
          }else{
            var dirReader = dirEntry.createReader();
            dirReader.readEntries(function(entries){
              
              entries.sort(function(a, b){
                if(a.isDirectory == b.isDirectory){
                  var a_name = a.name.toLowerCase();
                  var b_name = b.name.toLowerCase();
                  
                  if(a_name < b_name) return -1;
                  if(a_name > b_name) return 1;
                  return 0;
                }
                return a.isDirectory ? -1 : 1;
              });
              
              onDone(entries);
            }, FileManager.error);
          }
		},
        error : function(e) {
          var msg = '';

          switch (e.code) {
            case FileError.QUOTA_EXCEEDED_ERR:
              msg = 'QUOTA_EXCEEDED_ERR';
              break;
            case FileError.NOT_FOUND_ERR:
              msg = 'NOT_FOUND_ERR';
              break;
            case FileError.SECURITY_ERR:
              msg = 'SECURITY_ERR';
              break;
            case FileError.INVALID_MODIFICATION_ERR:
              msg = 'INVALID_MODIFICATION_ERR';
              break;
            case FileError.INVALID_STATE_ERR:
              msg = 'INVALID_STATE_ERR';
              break;
            default:
              msg = 'Unknown Error';
              break;
          };

          console.log('Error: ' + msg);
        }

      };
      
    },
    templateUrl: 'templates/directive/chooseFilePick.html'
  };
})

;
