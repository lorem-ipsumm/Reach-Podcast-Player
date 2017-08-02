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

  /*
  $scope.test = function(index){

    if(!$scope.entries[index].itunes.duration.includes(":")){
      var value = $scope.entries[index].itunes.duration;
      var d = Number(value);
      var hour = Math.floor(d/3600);
      var minute = Math.floor(d % 3600 / 60);
      var second = Math.floor(d % 3600 % 60);
      var minuteDisplay = minute;
      var secondDisplay = second;
      var hourDisplay = hour;

      if(minute < 10)
        minuteDisplay = "0" + minute;
      else
        minuteDisplay = minute;

      if(second < 10)
        secondDisplay = "0" + second;
      else
        secondDisplay = second;

      if(hour < 10)
        hourDisplay = "0" + hour;
      else
        hourDisplay = hour;


      if(hour == 0)
        console.log(minuteDisplay + ":" + secondDisplay);
      else
        console.log(hourDisplay + ":" + minuteDisplay + ":" + secondDisplay);
    }else{
      console.log($scope.entries[index].itunes);
    }

  }
  */


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


//Dispalying the duration of each podcast
.directive('convert',function($rootScope){
  return{
    link: function($scope,element,attr){
      var index = $scope.$index;
      if($scope.entries[index].itunes.duration != undefined){
        if(!$scope.entries[index].itunes.duration.includes(":")){
          var value = $scope.entries[index].itunes.duration;
          var d = Number(value);
          var hour = Math.floor(d/3600);
          var minute = Math.floor(d % 3600 / 60);
          var second = Math.floor(d % 3600 % 60);
          var minuteDisplay = minute;
          var secondDisplay = second;
          var hourDisplay = hour;

          if(minute < 10)
            minuteDisplay = "0" + minute;
          else
            minuteDisplay = minute;

          if(second < 10)
            secondDisplay = "0" + second;
          else
            secondDisplay = second;

          if(hour < 10)
            hourDisplay = "0" + hour;
          else
            hourDisplay = hour;


          if(hour == 0)
            element[0].textContent = minuteDisplay + ":" + secondDisplay;
          else
            element[0].textContent = hourDisplay + ":" + minuteDisplay + ":" + secondDisplay;
        }else{

          element[0].textContent = $scope.entries[index].itunes.duration;

        }
      }

    }

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
