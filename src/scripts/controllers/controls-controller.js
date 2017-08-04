angular.module('main').controller('controls',function($rootScope,$scope,$interval,$window){
  $scope.paused = true;
  $scope.audioLink = "";
  $scope.value = 0;
  $scope.ceil = 0;
  $scope.position = 0;
  $scope.dragging = false;
  $scope.nextQueue = [];
  $scope.previousQueue = [];


  //Pause episode on space and move +/- five seconds with arrow keys
  angular.element($window).on('keydown',function(e){
    if(e.code == "Space" && (document.activeElement.id != "filter" && document.activeElement.id != "url-input")){
      e.preventDefault();
      $scope.pauseClicked();
    }else if(e.code == "ArrowLeft"){
      if($scope.sound != undefined){
        $scope.sound.seek($scope.sound.seek() - 5);
        $scope.slider.options.value = $scope.sound.seek();
      }
    }else if(e.code == "ArrowRight"){
      if($scope.sound != undefined){
        $scope.sound.seek($scope.sound.seek() + 5);
        $scope.slider.options.value = $scope.sound.seek();
      }
    }
  });



  $scope.$on('remove-item',function(event, arg){
    //if($scope.sound != undefined)
      //$scope.sound.unload()
  });


  //Called when a user adds an episode to the queue
  $scope.$on('queue',function(event, arg){
    $scope.nextQueue.push(arg);
  });





  $scope.$on('episode-clicked',function(event, arg){
    $scope.nowPlaying = arg;
    $scope.playingImage = arg.imageURL;
    $scope.playingTitle = arg.data.title;
    $scope.playingAuthor = arg.author;
    $scope.audioLink = arg.data.enclosure.url;
    $scope.podcastName = arg.podcastName;
    $interval.cancel($scope.timer);
    $scope.slider.options.value = 0;

    //$scope.sound.src[0] = $scope.audioLink;

    if($scope.sound != undefined)
      $scope.sound.unload();

    $scope.sound = new Howl({
      src: [$scope.audioLink],
      html5: true
    });


    //$scope.ceil = $scope.sound._duration;
    $scope.sound.on('load',function(){
      $scope.ceil = $scope.sound._duration;
      $scope.slider.options.ceil = $scope.sound._duration;
      $scope.position = $scope.sound.seek();
      $scope.$apply();
    });

    $rootScope.$broadcast('reorder',$scope.podcastName);

    $scope.playEpisode();

    });


    $scope.slider = {
        options:{
          value: 0,
          floor: 0,
          ceil: 0,
          step: 1,


          translate: function(value){
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
              return(minuteDisplay + ":" + secondDisplay);
            else
              return(hourDisplay + ":" + minuteDisplay + ":" + secondDisplay);
          },


          onStart: function(){
            $scope.dragging = true;
          },

          onEnd: function(){
            if($scope.sound != null){
              //console.log("okay");
              $scope.sound.seek($scope.slider.options.value);
              $scope.dragging = false;
            }
          }
        }
    };

    $scope.volume = {
      options:{
        value: 100,
        floor: 0,
        ceil: 100,
        step: 1,
        hideLimitLabels: true,
        translate: function(value){
          return("");
        },


        onChange: function(){
          if($scope.sound != null){
            $scope.sound.volume($scope.volume.options.value/100);
          }
        },

      }
    };


  $scope.playEpisode = function(){
    $scope.timer = $interval(function refresh(){
      if(!$scope.dragging && $scope.sound.state() != "loading")
        $scope.slider.options.value = $scope.sound.seek();
    }, 500);

    $scope.sound.volume($scope.volume.options.value/100);
    $scope.sound.play();
    $scope.sound.on('end',function(){
      if($scope.nextQueue.length > 0)
        $scope.playNextEpisode();
    });
    $scope.paused = false;
    angular.element(document.querySelector('#pause-button'))[0].src = "./res/control-buttons/pause-icon.png";
  }



  $scope.playNextEpisode = function(){
    $scope.paused = true;
    arg = $scope.nextQueue[0];
    $scope.playingImage = arg.imageURL;
    $scope.playingTitle = arg.data.title;
    $scope.playingAuthor = arg.author;
    $scope.audioLink = arg.data.enclosure.url;
    $scope.podcastName = arg.podcastName;
    //$scope.sound.src[0] = $scope.audioLink;

    if($scope.sound != undefined)
      $scope.sound.unload();

    $scope.sound = new Howl({
      src: [$scope.audioLink],
      html5: true
    });


      //$scope.ceil = $scope.sound._duration;
    $scope.sound.on('load',function(){
      $scope.ceil = $scope.sound._duration;
      $scope.slider.options.ceil = $scope.sound._duration;
      $scope.position = $scope.sound.seek();
      $scope.$apply();
    });

    $rootScope.$broadcast('reorder',$scope.podcastName);
    //remove the first item of the next queue and then add what's currently playing to the previous queue
    $scope.nextQueue.shift();
    $scope.previousQueue.unshift($scope.nowPlaying);


    $scope.nowPlaying = arg;
    $scope.playEpisode();
  }

  $scope.playPreviousEpisode = function(){
    $scope.paused = true;
    arg = $scope.previousQueue[0];
    $scope.playingImage = arg.imageURL;
    $scope.playingTitle = arg.data.title;
    $scope.playingAuthor = arg.author;
    $scope.audioLink = arg.data.enclosure.url;
    $scope.podcastName = arg.podcastName;
    //$scope.sound.src[0] = $scope.audioLink;

    if($scope.sound != undefined)
      $scope.sound.unload();

    $scope.sound = new Howl({
      src: [$scope.audioLink],
      html5: true
    });


      //$scope.ceil = $scope.sound._duration;
    $scope.sound.on('load',function(){
      $scope.ceil = $scope.sound._duration;
      $scope.slider.options.ceil = $scope.sound._duration;
      $scope.position = $scope.sound.seek();
      $scope.$apply();
    });



    $rootScope.$broadcast('reorder',$scope.podcastName);
    //remove the first item of the previous queue and then add what's currently playing to the next queue
    $scope.previousQueue.shift();
    $scope.nextQueue.unshift($scope.nowPlaying);


    $scope.nowPlaying = arg;
    $scope.playEpisode();


  }


  $scope.pauseClicked = function(){
    if($scope.audioLink != ""){
      if($scope.paused){
        $scope.sound.play();
        $scope.paused = false;
        angular.element(document.querySelector('#pause-button'))[0].src = "./res/control-buttons/pause-icon.png";
      }else{
        $scope.sound.pause();
        $scope.paused = true;
        angular.element(document.querySelector('#pause-button'))[0].src = "./res/control-buttons/play-icon.png";
      }
    }
  }

  $scope.nextClicked = function(){
    if($scope.nextQueue.length > 0){
      $scope.playNextEpisode();
    }
  }

  $scope.previousClicked = function(){
    if($scope.previousQueue.length > 0){
      $scope.playPreviousEpisode();
    }
  }
});
