const parser = require('rss-parser');
const howler = require('howler');


angular.module('main',['ngAnimate'])




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




  $scope.imageClicked = function(title, author, image, desciption){
    //$scope.changeFocus("podcast-view");
    $rootScope.$broadcast('podcast-clicked',{
      'title': title,
      'author': author,
      'imageUrl': image,
      'description': desciption,
      'entries': $scope.entries
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
          'description': $scope.description
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


.controller('controls',function($rootScope,$scope){
  $scope.paused = true;
  $scope.audioLink = "";

  $scope.$on('episode-clicked',function(event, arg){
    //console.log(arg);
    $scope.playingImage = arg.imageURL;
    $scope.playingTitle = arg.data.title;
    $scope.playingAuthor = arg.author;
    $scope.audioLink = arg.data.enclosure.url;
    //$scope.sound.src[0] = $scope.audioLink;
    $scope.sound = new Howl({
      src: [$scope.audioLink],
      html5: true
    });
  });

  $scope.pauseClicked = function(){
    if($scope.paused){
      console.log($scope.sound);
      console.log("playing");
      $scope.sound.play();
      $scope.paused = false;
    }else{
      $scope.sound.pause();
      $scope.paused = true;
    }
  }
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
