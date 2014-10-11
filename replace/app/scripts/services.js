'use strict';
angular.module('Gen.services', ['pouchdb'])

//MODEL
.factory('testdb', function(pouchdb) {
  return pouchdb.create('test');
})
.factory('PetService', function(testdb) {

  var pets = {};
  return {
    all: function(onDone) {
      
      testdb.allDocs().then(function(allDocs){
        var data = allDocs.rows;
        var objCache = {};
        var getNextRow = function(it){
          if(it < allDocs.rows.length){
            var id = data[it].id;
            testdb.get(id).then(function(row){
              objCache[id] = row;
              getNextRow(it+1);
            });
          }else{

            pets = objCache;
            if(onDone){
              onDone(pets);
            }
          }
        };
        getNextRow(0);
      });
      
      if(onDone){
        onDone(pets);
      }

      return pets;
    },
    get: function(petId, onDone) {
        testdb.get(petId).then(function(data){
          pets[petId] = data;
          if(onDone){
            onDone(pets[petId]);
          }
        });
        if(onDone){
          onDone(pets[petId]);
        }
        return pets[petId];
      },
    remove: function(petId, onDone) {
      testdb.remove(petId, onDone);
    },
    put: function(id, title, description) {
      var save = function(id) {
        testdb.put({_id: id+'', title: title, description:description}).then(function(response) {
          // Do something with the response
          console.log('put: function', response);
        });
      };
      if(id){
        save(id);
      }else{
        testdb.info().then(function(info){
          /*jshint camelcase: false */
          id = info.update_seq;
          save(id);
        });
      }
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
