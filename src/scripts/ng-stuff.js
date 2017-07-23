const parser = require('rss-parser');
const howler = require('howler');






angular.module('main',['ngAnimate','rzModule'])




.controller('recents-controller', function($rootScope,$scope){

  $scope.clicked = false;
  $scope.edit = false;

  $scope.add = function(){
    $scope.recents.push({title: 'Cool Games Inc', author: 'Polygon'});
  };

  $scope.addButtonClicked = function(){
    if(!$scope.clicked){
      $scope.clicked = true;
    }else{
      var text = angular.element(document.querySelector('#url-input'))[0].value;
      if(text.length > 0){
        //Try to get URL
        add(text);
      }else{
        $scope.clicked = false;
        $scope.edit = false;
      }
    }
  };




  $scope.imageClicked = function(title, author, image, desciption,entries){
    //$scope.changeFocus("podcast-view");
    $rootScope.$broadcast('podcast-clicked',{
      'title': title,
      'author': author,
      'imageUrl': image,
      'description': desciption,
      'entries': entries
    });
  }



  $scope.$on('remove-item',function(event, arg){
    for(var i = 0; i < $scope.recents.length; i++){
      if($scope.recents[i].title == arg){
        $scope.recents.splice(i,1);
      }
    }
  });


  $scope.recents = [

  ];




  $scope.keyDown = function(e){
    var key = e.key;
    if(key == "Enter"){
      var text = angular.element(document.querySelector('#url-input'))[0].value;
      if(text.length > 0){
        //Try to get URL
        add(text);
      }else{
        $scope.clicked = false;
        $scope.edit = false;
      }
    }
  };



  //https://www.npr.org/rss/podcast.php?id=510289
  var debounce = false;
  function add(text){
    $scope.edit = false;
    $scope.clicked = false;
    angular.element(document.querySelector('#url-input'))[0].value = "";

    parser.parseURL($scope.inputUrl, function(err,parsed){
      if(debounce == false){
        debounce = true;

        $scope.imageUrl = parsed.feed.itunes.image;
        $scope.author = parsed.feed.itunes.author;
        $scope.title = parsed.feed.title;
        $scope.description = parsed.feed.description;
        $scope.entries = parsed.feed.entries;

        $scope.recents.unshift({
          'title': $scope.title,
          'author': $scope.author,
          'imageUrl': $scope.imageUrl,
          'description': $scope.description,
          'entries': $scope.entries
        });

        $scope.$apply();
      }

    });

    debounce = false;
  }

})


.controller('podcast-view', function($rootScope,$scope){
  //$scope.open = true;
  $scope.$on('podcast-clicked',function(event, arg){
    $scope.author = arg.author;
    $scope.title = arg.title;
    $scope.imageUrl = arg.imageUrl;
    $scope.description = arg.description;
    $scope.open = true;
    $scope.entries = arg.entries;




  });

  $scope.removeClicked = function(name){
    $scope.open = false;
    $rootScope.$broadcast('remove-item',name);
  }


  $scope.episodeClicked = function(data){
    $rootScope.$broadcast('episode-clicked',{
      'data': data,
      'imageURL': $scope.imageUrl,
      'author': $scope.author
    });
  }




})
//http://feeds.feedburner.com/CoolGamesInc


.controller('controls',function($rootScope,$scope,$interval){
  $scope.paused = true;
  $scope.audioLink = "";
  $scope.value = 0;
  $scope.ceil = 0;
  $scope.position = 0;
  $scope.dragging = false;




  $scope.$on('remove-item',function(event, arg){
    if($scope.sound != undefined)
      $scope.sound.unload();
  });




  $scope.$on('episode-clicked',function(event, arg){
    $scope.playingImage = arg.imageURL;
    $scope.playingTitle = arg.data.title;
    $scope.playingAuthor = arg.author;
    $scope.audioLink = arg.data.enclosure.url;
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

            if(minute < 10)
              minuteDisplay = "0" + minute;
            else
              minuteDisplay = minute;

            if(second < 10)
              secondDisplay = "0" + second;
            else
              secondDisplay = second;

            //console.log();
            return(minuteDisplay + ":" + secondDisplay);
          },


          onStart: function(){
            $scope.dragging = true;
          },

          onEnd: function(){
            $scope.sound.seek($scope.slider.options.value);
            $scope.dragging = false;
          }
        }
    };

  $scope.playEpisode = function(){


    $scope.timer = $interval(function refresh(){
      if(!$scope.dragging)
        $scope.slider.options.value = $scope.sound.seek();
    }, 1000);

    $scope.sound.play();
    $scope.paused = false;
    angular.element(document.querySelector('#pause-button'))[0].src = "./res/control-buttons/pause-icon.png";
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
})


.directive('test',function($window){
  return function(scope,element,attrs){
    console.log("hi");
  };
})

.directive('scroll',function($window){
  var xVel = 0;
  return function(scope,element,attrs){
    angular.element(document.querySelector('.side-scroll')).bind('mousewheel',function(e){

      if(e.deltaY > 0){
        element[0].scrollLeft += 50;
      }else {
        element[0].scrollLeft -= 50;
      }

    });
  };
});
