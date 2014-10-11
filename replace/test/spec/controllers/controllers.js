'use strict';

describe('Controller: ArriveCtrl', function () {

  // load the controller's module
  beforeEach(module('Gen.controllers'));

  var ArriveCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ArriveCtrl = $controller('ArriveCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of arrives from nearest busstops', function () {
    expect(scope.busstops.length).toBe(2);
  });
});
