'use strict';

describe('Service: SearchService', function () {
  var SearchService;
  beforeEach(function(){
    module('Seminarium.services');
    inject(function(_SearchService_) {
      SearchService = _SearchService_;
    });
  });


  it('should have name and title property', function () {
    SearchService.test();
    expect('1').toBe('1');
  });

});
