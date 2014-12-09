'use strict';
/*global PouchDB */

angular.module('Seminarium.services', [])
.factory('ConfigService', function() {
  return {
    geolocation : {
      options : { 
        maximumAge: 20000, 
        timeout: 1000, 
        enableHighAccuracy: true 
      },
      defaultPosition : {
        lat : 54.37157,
        lon : 18.61234
      }
    },
    db : {
      name : 'Seminarium'
      //name : 'http://localhost:5984/seminarium'
    },
    sync : {
      base_url : 'http://seminarium.mardraze.waw.pl/getJson.php'
    }
  };
})
.factory('DB', function(ConfigService) {

  var DB = {
      
    cache : {},
    db : null,
    name : ConfigService.db.name,
    getCleanDb : function(onDone){
      var db = new PouchDB(DB.name, function(){
        db.destroy(function(err, info) { 
          if(info.ok === true){
            db = new PouchDB(DB.name, function(){
              DB.db = db;
              onDone(DB.db);
            });
          }
        });
      });
    },
    getDb : function(onDone){
      if(DB.db === null){
        var db = new PouchDB(DB.name, function(){
          DB.db = db;
          onDone(DB.db);
        });
      }else{
        onDone(DB.db);
      }
    },
    getTable : function(table, onDone){
      if(undefined === DB.cache[table]){
        DB.getDb(function(db){
          db.get(table, function(err, tableData){
            if(err === null){
              if(undefined === DB.cache[table]){
                DB.cache[table] = tableData;
              }
              onDone(DB.cache[table]);
            }else{
              onDone(null);
            }
          });
        });
      }else{
        onDone(DB.cache[table]);
      }
    }
    
  };
  return DB;
})
.factory('Leaflet', function(DB, UserPosition) {
  var leaflet = {
    scope : null,
    setup : function($scope){
      angular.extend($scope, {
        defaults: {
          tileLayer: 'images/seminarium_atlas/MapQuest/{z}/{x}/{y}.jpg',
          maxZoom: 15,
          minZoom: 9,
          touchZoom : true
        },
        center: {
          lat: 54.370,
          lng: 18.616,
          zoom: 15
        },
        paths : {},
        'markers' : {}
      });
      leaflet.scope = $scope;
    },    
    setBusstopMarker : function(busstop, center){
      var lat = (busstop.position ? busstop.position.lat :  busstop.lat)  * 1.0;
      var lng = (busstop.position ? busstop.position.lng :  busstop.lon)  * 1.0;
      leaflet.scope.markers[busstop.id] = {
        lat: lat,
        lng: lng,
        message: busstop.name,
        focus: false,
        draggable: false
      };
      if(center){
        leaflet.scope.center = {
          lat: lat,
          lng: lng,
          zoom: 15
        };
      }
      
    },
    setUserMarker : function(onDone, center){
      UserPosition.get(function(lat, lng){
        leaflet.scope.userPosition = {
          lat : lat,
          lng : lng
        };
        leaflet.scope.markers['user_position'] = {
            lat: lat,
            lng: lng,
            icon: {
              iconUrl: 'images/marker-icon-red.png',
              iconAnchor: [14, 0]         
            },
            message: "Moja pozycja",
            focus: false,
            draggable: false
        };
        if(center){
          leaflet.scope.center = {
            lat: lat,
            lng: lng,
            zoom: 15
          };
        }
        leaflet.scope.$apply();
        onDone();
      });
    },
    pathUserToBusstop : function(busstop){
      leaflet.path([
        [leaflet.scope.userPosition.lat, leaflet.scope.userPosition.lng],
        [busstop.lat, busstop.lon]
      ]);
    },
    
    path : function(route){
      var latlngs = [];
      for(var i=0; i<route.length; i++){
        latlngs.push({
          lat : route[i][0] * 1.0,
          lng : route[i][1] * 1.0
        });
      }
      
      leaflet.scope.paths['path'] = {
          color: '#008000',
          weight: 8,
          latlngs: latlngs
      };
      leaflet.scope.$apply();
    }
    
    
  };
  
  return leaflet;
})
.factory('Busstop', function(DB) {
  var Busstop = {
    getOneById : function(id, onDone){
      DB.getTable('busstops', function(busstops){
        var arr = busstops.busstops;
        for(var i=0; i<arr.length; i++){
          if(arr[i].id === id){
            onDone(arr[i]);
            return;
          }
        }
        onDone(null);
      });
    },
    getByRange : function(obj, onDone){
      var lat1 = obj.centerLat * 1.0;
      var lon1 = obj.centerLon * 1.0;
      var distanceKm = obj.distanceKm;
      DB.getTable('busstops', function(busstops){
        var arr = busstops.busstops;
        var result = [];
        var toRadians = function(Value){
          return Value * Math.PI / 180;
        };
        for(var i=0; i<arr.length; i++){
          if(arr[i].name){
            var lat2 = arr[i].lat * 1.0;
            var lon2 = arr[i].lon * 1.0;
            var R = 6371; // km
            var O1 = toRadians(lat1);
            var O2 = toRadians(lat2);
            var DO = toRadians(lat2-lat1);
            var DL = toRadians(lon2-lon1);
            var a = Math.sin(DO/2) * Math.sin(DO/2) +
                    Math.cos(O1) * Math.cos(O2) *
                    Math.sin(DL/2) * Math.sin(DL/2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            var d = R * c;
            if(d < distanceKm){
              arr[i].distance = d;
              result.push(arr[i]);
            }
          }
        }
        
        result.sort(function(a, b){
          return a.distance - b.distance;
        });
        if(obj.count > 0){
          result = result.slice(obj.offset*1, (obj.offset*1)+obj.count);
        }
        onDone(result);
      });
    }
  };
  return Busstop;
})
.factory('Sync', function(DB, $http, ConfigService) {
  var Sync = {
    
    //BASE_URL : ConfigService.sync.base_url,
    BASE_URL : 'http://localhost/test/phonegap/Seminarium/server/getJson.php',
    db : null,
    running : false,
    currentBusstop : 0,
    busstops : null,
    onDone : function(){},
    onProgress : function(){},
    onError : function(){},
    fromObject : {},
    tables : ['company', 'line', 'positions'],
    run : function(){
      console.log('Sync.run');
      if(!Sync.running){
        Sync.running = true;
        Sync.getBusstops(function(busstops){
          var getArrives = function(){
            if(Sync.running){
              if(Sync.currentBusstop < busstops.length){
                var busstopId = busstops[Sync.currentBusstop].id;
                Sync.getData('?data=arrives&busstop_id='+busstopId, function(res){
                  Sync.onProgress((Sync.currentBusstop/busstops.length) * 100);
                  if(res.success){
                    if(busstopId){
                      busstops[Sync.currentBusstop].arrives = res.data;
                      Sync.currentBusstop++;
                      getArrives();
                    }
                  }
                });
              }else{
                DB.getCleanDb(function(db){
                  db.put({
                    busstops : busstops
                  }, 'busstops').then(function(){
                    var current = 0;
                    var getTable = function(){
                      if(current < Sync.tables.length){
                        var table = Sync.tables[current++];
                        Sync.getTable(table, function(data){
                          db.put({
                            'data' : data
                          }, table).then(function(){
                            getTable();
                          });
                        });
                      }else{
                        Sync.running = false;
                        Sync.onDone();
                      }
                    };
                    getTable();
                  });
                });
              }
            }
          };
          getArrives();
        });
      }
    },
    
    getBusstops : function(onDone){
      console.log('getBusstops');
      if(Sync.busstops === null){
        Sync.getData('?data=busstop', function(res){
          if(res.success){
            Sync.busstops = res.data;
            onDone(Sync.busstops);
          }
        });
      }else{
        onDone(Sync.busstops);
      }
    },
    getData : function(url, onSuccess){
      if(Sync.fromObject && Sync.fromObject.hasOwnProperty(url)){
        onSuccess(JSON.parse(Sync.fromObject[url]));
      }else{
        console.log('getData '+url);
        var dataParams = url.replace('?', '').split('&');
        var keys = [];
        var values = [];
        for(var i=0; i<dataParams.length; i++){
          var kv = dataParams[i].split('=');
          keys.push(kv[0]);
          values.push(kv[1]);
        }
        var dataUrl = 'data/'+keys.join('_')+'/'+values.join('_')+'.data';
        //var dataUrl = Sync.BASE_URL+url;
        console.log(dataUrl);
        $http.get(dataUrl).success(function(res){
          onSuccess(res);
        });
      }
      
    },
    getTable : function(table, onDone){
      Sync.getData('?table='+table, function(res){
        if(res.success){
          onDone(res.data);
        }
      });
    },
    
    pause : function(){
      if(Sync.running){
        Sync.running = false;
      }
    },
    isLoaded : function(call){
      var current = 0;
      var checkTable = function(){
        var table = allTables[current++];
        DB.getTable(table, function(res){
          if(res){
            if(current < allTables.length){
              checkTable();
            }else{
              call.onSuccess();
            }
          }else{
            call.onError(table);
          }
        });
      };
      var allTables = ['busstops'];
      var tables = Sync.tables;
      for(var i=0; i<tables.length; i++){
        allTables.push(tables[i]);
      }
      checkTable();
    }
    
  };
  return Sync;
})
.factory('UserPosition', function(ConfigService) {
  var geolocationMessageShown = false;
  return {
    get : function(onDone, onError){
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position){
          //console.log('Geolocation taken: ['+position.coords.latitude +':'+ position.coords.longitude+']');
          onDone(position.coords.latitude, position.coords.longitude);
        }, function(){
          console.log('Default Geolocation taken');
          onDone(ConfigService.geolocation.defaultPosition.lat, ConfigService.geolocation.defaultPosition.lon);
        }, ConfigService.geolocation.options);
      } else {
        console.log("Geolocation is not supported by this browser.");
      }
    }
  };
})
.factory('SearchService', function(Busstop, Sync, UserPosition) {
  var cache;
  var lastGet = new Date();
  return {
    test : function(){},
    isLoaded : function(call){
      Sync.isLoaded(call);
    },
    getNearestBusstops : function(onDone, count, offset, params){
      var dateNow = new Date();

      if(true || lastGet == null || lastGet.getTime()+60*1000 < dateNow.getTime()){
        lastGet = dateNow;
        UserPosition.get(function(lat, lon){
          Busstop.getByRange({
            centerLat : lat,
            centerLon : lon,
            distanceKm : 20,
            count : count,
            offset : offset
          }, function(res){
            var onDoneData = [];
            var getVehicles = function(arrives){
              var result = [];
              var date = new Date();
              var dayTime = parseInt((date.getTime() % (24 * 3600 * 1000)) / 1000);

              var vehicles = {};
              for(var i=0; i<arrives.length; i++){
                var vehicleName = arrives[i].name;
                if(arrives[i].time > dayTime){
                  if(undefined === vehicles[vehicleName]
                    || (vehicles[vehicleName].weekTime > arrives[i].time &&vehicles[vehicleName].weekTime - arrives[i].time < 3600)){
                      vehicles[vehicleName] = {
                        'name' : vehicleName,
                        'dayTime' : arrives[i].time
                      };
                  }
                }
              }

              for(var key in vehicles){
                var time = parseInt((vehicles[key].dayTime - dayTime)/60);
                if(time < 10){
                  time = 'za '+time+' minut'+(time == 1 ? 'ę' : (time < 5) ? 'y' : '');
                }else{
                  var hour = parseInt(vehicles[key].dayTime/3600)+1;
                  var min = (vehicles[key].dayTime/60) % 60;
                  time = (hour%24)+':'+(min < 10 ? '0' : '')+min;
                }
                result.push({
                  'name' : (key[0] == '0' ? key.substr(1) : key),
                  'time' : time,
                  'dayTime' : vehicles[key].dayTime
                });
              }
              result.sort(function(a, b){
                return a.dayTime - b.dayTime;
              });
              return result;
            };
            for(var i=0; i<res.length; i++){
              if(res[i].name){
                onDoneData.push({
                  name: res[i].name,
                  vehicles : params && params.hasOwnProperty('without_vehicles') ? [] : getVehicles(res[i].arrives),
                  id : res[i].id,
                  position : {
                    lat : res[i].lat,
                    lng : res[i].lon
                  },
                  route : []
                });
              }
            }

            cache = onDoneData;
            onDone(onDoneData, offset);
          });
        });
      }else{
        onDone(cache, offset);
      }
    }
  };
})
.factory('ChooseFile', function($ionicPopup, $timeout) {
  
  return {
    openNative : function(win, fail){
      return cordova.exec(
        function (args) { 
          if(win !== undefined) { 
            win(args); 
          }
        },
        function (args) { 
          if(fail !== undefined) { 
            fail(args); 
          } 
        },
        "FileChooser", "open", []
      );
    },
    open : function(params){
      // Triggered on a button click, or some other target
      var $scope = params.scope;
      $scope.data = {}
      var title = params.title ? params.title : '';
      var subTitle = params.subTitle ? params.subTitle : '';
      
      // An elaborate, custom popup
      var myPopup = $ionicPopup.show({
        template: '<button class="button button-small button-balanced">Nowy folder</button>',
        title: title,
        subTitle: subTitle,
        scope: $scope,
        buttons: [
          { text: 'Cancel' },
          {
            text: '<b>Zapisz</b>',
            type: 'button-positive',
            onTap: function(e) {
              if (!$scope.data.wifi) {
                //don't allow the user to close unless he enters wifi password
                e.preventDefault();
              } else {
                return $scope.data.wifi;
              }
            }
          },
        ]
      });
      myPopup.then(function(res) {
        console.log('Tapped!', res);
      });
      $timeout(function() {
        myPopup.close(); //close the popup after 3 seconds for some reason
      }, 3000);
    }
    
  };
})
.factory('ToolsService', function() {
  return {
    click : function(elem, call){
      document.getElementById(elem).addEventListener('click', call);
    },
    val : function(elem){
      return document.getElementById(elem).value;
    },

    getParameterByName : function(name, str) {
      name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
      var regex = new RegExp('[\\?&]' + name + '=([^&#]*)'),
      results = regex.exec(str);
      return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    },

    uniqid :  function (prefix, moreEntropy) {
      //  discuss at: http://phpjs.org/functions/uniqid/
      // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
      //  revised by: Kankrelune (http://www.webfaktory.info/)
      //        note: Uses an internal counter (in phpJs global) to avoid collision
      //        test: skip
      //   example 1: uniqid();
      //   returns 1: 'a30285b160c14'
      //   example 2: uniqid('foo');
      //   returns 2: 'fooa30285b1cd361'
      //   example 3: uniqid('bar', true);
      //   returns 3: 'bara20285b23dfd1.31879087'

      if (typeof prefix === 'undefined') {
        prefix = '';
      }

      var retId;
      var formatSeed = function(seed, reqWidth) {
        seed = parseInt(seed, 10)
          .toString(16); // to hex str
        if (reqWidth < seed.length) { // so long we split
          return seed.slice(seed.length - reqWidth);
        }
        if (reqWidth > seed.length) { // so short we pad
          return (new Array(1 + (reqWidth - seed.length)))
            .join('0') + seed;
        }
        return seed;
      };

      var phpJs = {};
      phpJs.uniqidSeed = Math.floor(Math.random() * 0x75bcd15);
      phpJs.uniqidSeed++;

      retId = prefix; // start with prefix, add current milliseconds hex string
      retId += formatSeed(parseInt(new Date()
        .getTime() / 1000, 10), 8);
      retId += formatSeed(phpJs.uniqidSeed, 5); // add seed hex string
      if (moreEntropy) {
        // for more entropy we add a float lower to 10
        retId += (Math.random() * 10)
          .toFixed(8)
          .toString();
      }

      return retId;
    }
  };
})
;
