'use strict';
angular.module('Gen.controllers', [])


.controller('ArriveCtrl', function($scope) {
  $scope.busstops = [
    {
      title: 'Traugutta-Sobieskiego',
      vehicles : [
        {
          'name' : '199',
          'time' : 'za 1 minutę'
        }
      ]
    },
    {
      title: 'Miszewskiego',
      vehicles : [
        {
          'name' : '11',
          'time' : 'za 9 minut'
        }
      ]
    }
  ];
})

.controller('MapCtrl', function() {

})

.controller('SearchCtrl', function() {

})

.controller('FavoritesCtrl', function() {

})

.controller('DataCtrl', function() {

})


.controller('ActionCtrl', function($scope, $stateParams) {
  var redirect = '/tab';
  if($stateParams.action === 'save'){
    redirect = '/tab/search';
  }
  window.location.hash = redirect;
});
