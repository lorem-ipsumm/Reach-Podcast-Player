angular.module('main',['ngAnimate'])



.controller('recents-controller', function($scope){

  $scope.add = function(){
    $scope.recents.push({title: 'Cool Games Inc', publisher: 'Polygon'});
  };

  $scope.recents = [
    {title: 'The Daily', publisher: 'The NYT'},
    {title: 'TED Radio Hour', publisher: 'NPR'},
    {title: 'Up First', publisher: 'NPR'}
  ];



})

.directive('scroll',function($window){
  return function(scope,element,attrs){
    angular.element(document.querySelector('.side-scroll')).bind('mousewheel',function(e){
      console.log(element[0].scrollLeft);
      if(e.deltaY > 0){
        element[0].scrollLeft += 50;
      }else {
        element[0].scrollLeft -= 50;
      }
    });
  };
});
