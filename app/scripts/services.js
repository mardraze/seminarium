'use strict';
/*global PouchDB,$ */

angular.module('Seminarium.services', [])

.factory('DB', function() {
  var DB = {
    cache : {},
    db : null,
    name : 'Seminarium',
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
            if(err){
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
        onDone(result);
      });
    }
  };
  return Busstop;
})
.factory('Sync', function(DB, $http) {
  var Sync = {
    BASE_URL : 'http://localhost/test/test/psql_inzynierka/getJson.php',
    db : null,
    running : false,
    currentBusstop : 0,
    busstops : null,
    onDone : function(){},
    tables : ['company', 'line', 'positions'],
    run : function(){
      if(!Sync.running){
        Sync.running = true;
        Sync.getBusstops(function(busstops){
          Sync.currentBusstops = busstops.length;
          var getArrives = function(){
            if(Sync.running){
              if(Sync.currentBusstop < Sync.currentBusstops){
                var busstopId = busstops[Sync.currentBusstop].id;
                $http.get(Sync.BASE_URL+'?data=arrives&busstop_id='+busstopId).success(function(res){
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
      if(Sync.busstops === null){
        $http.get(Sync.BASE_URL+'?data=busstop').success(function(res){
          if(res.success){
            Sync.busstops = res.data;
            onDone(Sync.busstops);
          }
        });
      }else{
        onDone(Sync.busstops);
      }
    },

    getTable : function(table, onDone){
      $.getJSON(Sync.BASE_URL+'?table='+table, function(res){
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
            call.onError();
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
.factory('SearchService', function(Busstop, Sync) {
  return {
    test : function(){},
    isLoaded : function(call){
      Sync.isLoaded(call);
    },
    getNearestBusstops : function(onDone){
      Busstop.getByRange(10, function(res){
        console.log(res);
        onDone([
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
        ]);        
      });
      
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
