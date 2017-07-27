angular.module('main').controller('recents-controller',function($scope,$rootScope){
  $scope.listenQueue = [];
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




  $scope.$on('reorder',function(event,arg){
    for(var i = 0; i < $scope.recents.length; i++){
      if($scope.recents[i].title == arg){
        //console.log($scope.recents);
        var item = $scope.recents.splice(i,1)[0];
        $scope.recents.unshift(item);
        //console.log($scope.recents.splice(i,1));
        //console.log($scope.recents);
      }
    }
    fs.writeFile('./saved-podcasts.txt',JSON.stringify($scope.recents), function(err){
      if(!err)
        console.log("saved");
    });
  });



  $scope.$on('remove-item',function(event, arg){
    for(var i = 0; i < $scope.recents.length; i++){
      if($scope.recents[i].title == arg){
        $scope.recents.splice(i,1);
      }
    }

    fs.writeFile('./saved-podcasts.txt',JSON.stringify($scope.recents), function(err){
      if(!err)
        console.log("saved");
    });
  });


  if(fs.existsSync("./saved-podcasts.txt")){
    var file = fs.readFileSync("./saved-podcasts.txt")
    var text = JSON.parse(file);


    //update each podcast's entry list
    for(var i = 0; i < text.length;i++){
      update(i,text);
    }
    $scope.recents = text;
  }else{
    $scope.recents = []
  }


  function update(index,text){
    parser.parseURL(text[index].rssUrl, function(err,parsed){
      text[index].entries = parsed.feed.entries;
    });
  }


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
        if(parsed.feed.itunes.image != undefined)
          $scope.imageUrl = parsed.feed.itunes.image;
        else
          $scope.imageUrl = "./res/thumbnails/Radiolab.jpg";
        $scope.author = parsed.feed.itunes.author;
        $scope.title = parsed.feed.title;
        $scope.description = parsed.feed.description;
        $scope.entries = parsed.feed.entries;
        $scope.inputUrl;

        $scope.recents.unshift({
          'title': $scope.title,
          'author': $scope.author,
          'imageUrl': $scope.imageUrl,
          'description': $scope.description,
          'entries': $scope.entries,
          'rssUrl': $scope.inputUrl
        });
        fs.writeFile('./saved-podcasts.txt',JSON.stringify($scope.recents), function(err){
          if(!err)
            console.log("saved");
        });
        //console.log($scope.recents[0]);
        $scope.$apply();
      }

    });

    debounce = false;
  }

});
