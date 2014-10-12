'use strict';

describe('Controller: ArriveCtrl', function () {

  // load the controller's module
  beforeEach(module('Gen.controllers'));

  var ArriveCtrl, scope, asyncDone;

  var async = function(onAsyncDone){
    waitsFor(function() {
      return scope.asyncDone;
    }, "Async timeout", 5000);
    runs(onAsyncDone);
  };

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    scope.asyncDone = false;
    ArriveCtrl = $controller('ArriveCtrl', {
      $scope: scope
    });
  }));

  it('should busstops have title and vehicles property', function () {
    async(function() {
      for(var i=0; i<scope.busstops.length; i++){
        expect(scope.busstops[i].hasOwnProperty('title')).toBe(true);
        expect(scope.busstops[i].hasOwnProperty('vehicles')).toBe(true);
      }
    });
  });

  it('should busstops.vehicles array have name and title property', function () {
    async(function() {
      for(var i=0; i<scope.busstops.length; i++){
        for(var j=0; j<scope.busstops[i].vehicles.length; j++){
          expect(scope.busstops[i].vehicles[j].hasOwnProperty('name')).toBe(true);
          expect(scope.busstops[i].vehicles[j].hasOwnProperty('time')).toBe(true);
        }
      }
    });
  });

});
