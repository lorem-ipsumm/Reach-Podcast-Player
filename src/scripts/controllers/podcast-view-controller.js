angular.module('main').controller('podcast-view',function($scope,$rootScope,$window){
  //$scope.open = true;
  $scope.$on('podcast-clicked',function(event, arg){
    $scope.author = arg.author;
    $scope.title = arg.title;
    $scope.imageUrl = arg.imageUrl;
    $scope.description = arg.description;
    $scope.open = true;
    $scope.entries = arg.entries;
  });




  //Close window on escape
  angular.element($window).on('keydown',function(e){
    if(e.code == "Escape"){
      //$scope.pauseClicked();
      $scope.open = false;
      $scope.$apply();
    }
  });

  $scope.removeClicked = function(name){
    $scope.open = false;
    $rootScope.$broadcast('remove-item',name);
  }


  $scope.episodeClicked = function(data){

    $rootScope.$broadcast('episode-clicked',{
      'data': data,
      'imageURL': $scope.imageUrl,
      'author': $scope.author,
      'podcastName': $scope.title
    });
  }


})


.directive('rightClick',function($rootScope){
  return{
    link: function($scope,element,attr){

      angular.element(element).bind('mousedown',function(e){
        if(e.button == 2){

          $rootScope.$broadcast('queue',{
            'data': $scope.entry,
            'imageURL': $scope.imageUrl,
            'author': $scope.author,
            'podcastName': $scope.title
          });

        }
      });

    }
  }
});
