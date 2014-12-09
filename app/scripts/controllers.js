/* global L */
'use strict';
angular.module('Seminarium.controllers', ['Seminarium.services'])

.controller('ArriveCtrl', function($scope, $ionicLoading, $location, SearchService, ConfigService, Sync, DB) {
  
  console.log('ArriveCtrl Start');
  var enabled = true;
  $scope.$on('$destroy', function dismiss() {
    enabled = false;
    offset = 0;
  });
  $scope.progress = 0;
  $ionicLoading.show({
    template: 'Wczytywanie...'
  });
  var count = 1;
  var offset = 0;
  $scope.busstops = [];
  var getNearest = function(){
    console.log('ArriveCtrl::getNearest '+offset+' ');
    SearchService.getNearestBusstops(function(busstops, offsetResult){
      if(busstops && busstops.length > 0 && enabled){
        for(var i=0; i<busstops.length; i++){
          $scope.busstops.push(busstops[i]);
        }
        $scope.asyncDone = true;
        $scope.$apply();
        $ionicLoading.hide();
        offset += count;
        setTimeout(getNearest, 500);
      }
    }, count, offset);
  };
  setTimeout(function(){
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
  }, 1000);
})

.controller('MapCtrl', function($scope, SearchService, Leaflet) {
  Leaflet.setup($scope);
  var enabled = true;
  var offset = 0;
  $scope.$on('$destroy', function dismiss() {
    enabled = false;
    offset = 0;
  });

  setTimeout(function(){
    Leaflet.setUserMarker(function(){
      $scope.zoom = 15;
      var offset = 0;
      var count = 1;
      var getPoint = function(){
        SearchService.getNearestBusstops(function(busstops){
          if(busstops && enabled){
            for(var i=0; i<busstops.length && i < 10; i++){
              Leaflet.setBusstopMarker(busstops[i]);
            }
            $scope.$apply();
            offset += count;
            setTimeout(getPoint, 500);
          }
        }, count, offset, {
          without_vehicles : 1
        });
      };
      getPoint();
    }, true);
    
  }, 2000);
  
})

.controller('SearchCtrl', function($scope, DB) {
  $scope.run = true;
  $scope.$on('$destroy', function dismiss() {
    if(window.cordova){
      cordova.plugins.Keyboard.close();
    }
  });

  $scope.data = {
    'search' : '',
    'result' : []
  };
  var busstops = [];
  DB.getTable('busstops', function(data){
    busstops = data.busstops;
  });
  $scope.onKeyUp = function(){
    var value = ($scope.data.search).toLowerCase();
    $scope.data.result = [];
    if(value){
      try{
        for(var i=0; i<busstops.length; i++){
          var name = (busstops[i].name+'').toLowerCase();
          if(name.indexOf(value) !== -1){
            $scope.data.result.push(busstops[i]);
          }
        }
      }catch(e){
      }
    }
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

.controller('DataCtrl', function($scope, $window, ChooseFile, Sync) {
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

  $window.addEventListener('change', function(e){
    if(e.target.files){
    
      var file = e.target.files[0];

      console.log('openFile!');
      var reader = new FileReader();
      reader.onprogress = function(oEvent) {
        if (oEvent.lengthComputable) {
          var percentComplete = oEvent.loaded / oEvent.total;
          console.log('updateProgress '+percentComplete);
        }
      };
      reader.onload = function(){
        console.log('reader.onload!');
        Sync.fromObject = JSON.parse(reader.result);
        console.log('Parsed!');
        console.log(Sync.fromObject);
        Sync.onDone = function(){
          console.log('Sync.onDone');
        };
        
        Sync.onProgress = function(progress){
          console.log('Sync.onProgress '+progress);
        };
        Sync.onError = function(){
          console.log('Sync.onError');
        };

        Sync.run();
      };
      reader.readAsText(file);    
    }
    
  });
  
})
.controller('DetailsCtrl', function($scope, $stateParams, DB, Leaflet) {
  var id = $stateParams.id;
  if(id){
    Leaflet.setup($scope);
    
    var showMap = function(busstop){
      Leaflet.setUserMarker(function(){
        Leaflet.setBusstopMarker(busstop, true);
        Leaflet.pathUserToBusstop(busstop);
      });
    };
    
    DB.getTable('busstops', function(data){
      var busstops = data.busstops;
      for(var i=0; i<busstops.length; i++){
        if(busstops[i].id == id){
          showMap(busstops[i]);
          break;
        }
      }
    });
  }
  
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
              $scope.popupResult = '';
              FileManager.getEntries(entry, function(entries){
                $scope.popupEntries = entries;
              });              
            }, function(){
              $scope.parentDir = null;
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
          var syncData = function(content){
            
            console.log('reader.onload!');
            Sync.fromObject = JSON.parse(content);
            console.log('Parsed!');
            console.log(Sync.fromObject);
            Sync.onDone = function(){
              console.log('Sync.onDone');
            };

            Sync.onProgress = function(progress){
              console.log('Sync.onProgress '+progress);
            };
            Sync.onError = function(){
              console.log('Sync.onError');
            };

            Sync.run();   
          };
          
          entry.file(function(file) { //cordova only
              var reader = new FileReader();
              reader.onloadend = function(e) {
                syncData(this.result);
              }
              reader.readAsText(file);
          });
          /* //chrome
          var reader = new FileReader();
          reader.onloadend = function (evt) {
            syncData(reader.result);
          };
          reader.readAsText(window.cordova.file.externalRootDirectory+entry.fullPath);
          */
        }, function (error) {
            console.log(error.code);
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
