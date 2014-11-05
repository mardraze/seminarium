'use strict';


describe('Controller: ArriveCtrl', function () {

  beforeEach(module('Seminarium.controllers'));

  var ArriveCtrl, scope;
  var async = function(onAsyncDone){
    waitsFor(function() {
      return scope.asyncDone;
    }, "Async timeout", 1000);
    runs(onAsyncDone);
  };

  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    scope.asyncDone = false;
    ArriveCtrl = $controller('ArriveCtrl', {
      $scope: scope
    });
  }));

  it('should have title and vehicles property', function () {
    async(function() {
      for(var i=0; i<scope.busstops.length; i++){
        expect(scope.busstops[i].hasOwnProperty('name')).toBe(true);
        expect(scope.busstops[i].hasOwnProperty('vehicles')).toBe(true);
      }
    });
  });

  it('should have name and title property', function () {
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


describe('Controller: FavoritesCtrl', function () {

  beforeEach(module('Seminarium.controllers'));
  var async = function(onAsyncDone){
    waitsFor(function() {
      return scope.asyncDone;
    }, "Async timeout", 1000);
    runs(onAsyncDone);
  };
  
  var FavoritesCtrl, scope;

  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    scope.asyncDone = false;
    FavoritesCtrl = $controller('FavoritesCtrl', {
      $scope: scope
    });
  }));

  it('should have group and elements properties', function () {
    async(function() {
      for(var i=0; i<scope.favorites.length; i++){
        expect(scope.favorites[i].hasOwnProperty('name')).toBe(true);
        expect(scope.favorites[i].hasOwnProperty('elements')).toBe(true);
      }
    });
  });

  it('should have name and sort properties', function () {
    async(function() {
      for(var i=0; i<scope.favorites.length; i++){
        for(var j=0; j<scope.favorites[i].elements.length; j++){
          expect(scope.favorites[i].elements[j].hasOwnProperty('name')).toBe(true);
          expect(scope.favorites[i].elements[j].hasOwnProperty('sort')).toBe(true);
        }
      }
    });
  });

});


describe('Controller: DataCtrl', function () {

  beforeEach(module('Seminarium.controllers'));
  var async = function(onAsyncDone){
    waitsFor(function() {
      return scope.asyncDone;
    }, "Async timeout", 1000);
    runs(onAsyncDone);
  };
  
  var DataCtrl, scope;

  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    scope.asyncDone = false;
    DataCtrl = $controller('DataCtrl', {
      $scope: scope
    });
  }));

  it('should have id and name properties', function () {
    async(function() {
      for(var i=0; i<scope.list.length; i++){
        expect(scope.list[i].hasOwnProperty('id')).toBe(true);
        expect(scope.list[i].hasOwnProperty('name')).toBe(true);
        expect(scope.list[i].hasOwnProperty('description')).toBe(true);
        expect(scope.list[i].hasOwnProperty('updatedAt')).toBe(true);
      }
    });
  });

});

describe('Controller: DataDetailsCtrl', function () {

  beforeEach(module('Seminarium.controllers'));
  var async = function(onAsyncDone){
    waitsFor(function() {
      return scope.asyncDone;
    }, "Async timeout", 1000);
    runs(onAsyncDone);
  };
  
  var DataDetailsCtrl, scope;

  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    scope.asyncDone = false;
    DataDetailsCtrl = $controller('DataDetailsCtrl', {
      $scope: scope
    });
  }));

  it('should have id and name properties', function () {
    async(function() {
      expect(scope.data.hasOwnProperty('id')).toBe(true);
      expect(scope.data.hasOwnProperty('name')).toBe(true);
      expect(scope.data.hasOwnProperty('description')).toBe(true);
      expect(scope.data.hasOwnProperty('updatedAt')).toBe(true);
    });
  });

});




describe('Controller: MapCtrl', function () {

  beforeEach(module('Seminarium.controllers'));
  var async = function(onAsyncDone){
    waitsFor(function() {
      return scope.asyncDone;
    }, "Async timeout", 1000);
    runs(onAsyncDone);
  };
  
  var MapCtrl, scope;

  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    scope.testing = true;
    scope.asyncDone = false;
    MapCtrl = $controller('MapCtrl', {
      $scope: scope
    });
  }));

  it('should have user\'s position, zoom and busstop list', function () {
    async(function() {
      expect(scope.hasOwnProperty('userPosition')).toBe(true);
      expect(scope.hasOwnProperty('list')).toBe(true);
      expect(scope.hasOwnProperty('zoom')).toBe(true);
    });
  });

  it('should have position with lat and lng params', function () {
    async(function() {
      expect(scope.userPosition.hasOwnProperty('lat')).toBe(true);
      expect(scope.userPosition.hasOwnProperty('lng')).toBe(true);
      for(var i=0; i<scope.list.length; i++){
        expect(scope.list[i].hasOwnProperty('id')).toBe(true);
        expect(scope.list[i].hasOwnProperty('position')).toBe(true);
        expect(scope.list[i].position.hasOwnProperty('lat')).toBe(true);
        expect(scope.list[i].position.hasOwnProperty('lng')).toBe(true);
      }
    });
  });

  it('should have route from user to busstop as list positions {lan,lng}', function () {
    async(function() {
      for(var i=0; i<scope.list.length; i++){
        expect(scope.list[i].hasOwnProperty('route')).toBe(true);
        for(var j=0; j<scope.list[i].route.length; j++){
          expect(scope.list[i].route[j].hasOwnProperty('lat')).toBe(true);
          expect(scope.list[i].route[j].hasOwnProperty('lng')).toBe(true);
        }
      }
    });
  });

});


describe('Controller: SearchCtrl', function () {

  beforeEach(module('Seminarium.controllers'));
  var async = function(onAsyncDone){
    waitsFor(function() {
      return scope.asyncDone;
    }, "Async timeout", 1000);
    runs(onAsyncDone);
  };
  
  var SearchCtrl, scope;

  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    scope.asyncDone = false;
    SearchCtrl = $controller('SearchCtrl', {
      $scope: scope
    });
  }));

  it('should have empty list if no param', function () {
    var list = scope.onKeyUp();
    expect(list.length).toEqual(0);
  });

  it('should have empty list if param too short', function () {
    var list = scope.onKeyUp('2');
    expect(list.length).toEqual(0);
  });

  it('should have list with length less than 5', function () {
    var list = scope.onKeyUp('11');
    expect(list.length).toBeLessThan(5);
  });

});
