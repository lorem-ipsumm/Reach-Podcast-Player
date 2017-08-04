angular.module('main').controller('recents-controller',function($scope,$rootScope){
  $scope.database_entries = admin.database().ref("podcast-entries");
  $scope.listenQueue = [];
  $scope.clicked = false;
  $scope.edit = false;


  //Attempt to upload everything to the global databse on window close
  window.onbeforeunload = function(evt){
    $scope.database_entries.update($scope.local_database);
  }



  //Download the database upon startup
  $scope.database_entries.once("value",function(snapshot){
    $scope.local_database = snapshot.val();
    console.log("database loaded");
  });





  $rootScope.$on('$routeChangeStart',function(scope, next, current){

    fs.writeFile('./test-podcasts.txt',"um", function(err){
      if(!err)
        console.log("saved");
    });
  });

  $scope.addButtonClicked = function(){
    if(!$scope.clicked){
      $scope.clicked = true;
    }else{
      var text = angular.element(document.querySelector('#url-input'))[0].value;
      if(text.length > 0){
        //Try to get URL
        //console.log(text);
        $scope.add(text);
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



  //Reorder the list so that recent podcasts appear first
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
      var text = $scope.inputUrl;
      if(text.length > 0){
        //Try to get URL
        $scope.add(text);
      }else{
        $scope.clicked = false;
        $scope.edit = false;
      }
    }
  };


  //For database searching
  $scope.ctrlDown = false;
  $scope.filterKeyDown = function(e){
    var key = e.key;
    if(key == "Control")
      $scope.ctrlDown = true;

    //Ctrl+Enter
    if(key == "Enter"){
      if($scope.ctrlDown){
        //Prevent duplicates
        if(!$scope.searchRecents($scope.query.toLowerCase())){
          //If the podcast is in the local database add it to the recents list
          if($scope.local_database[$scope.query.toLowerCase()] != undefined){
            var data = $scope.local_database[$scope.query.toLowerCase()];
            $scope.query = "";
            $scope.add(data.url);
          }else{
            //Display some sort of mesage telling the user that they will need to manually add the url
            console.log("Nothing found");
          }
        }


      }
    }

  };

  $scope.filterKeyUp = function(e){
    var key = e.key;
    if(key == "Control")
      $scope.ctrlDown = false;
  };


  //Return true if the query is in the recent list
  $scope.searchRecents = function(query){
    for(var i = 0; i < $scope.recents.length; i++){
      if($scope.recents[i].title.toLowerCase() == query){
        return true;
      }
    }
    return false;
  }

  var debounce = false;
  $scope.add = function(text){
    $scope.edit = false;
    $scope.clicked = false;
    $scope.inputUrl = "";
    if(text.includes("https://") || text.includes("http://")){
      parser.parseURL(text, function(err,parsed){
        //console.log(text);
        if(debounce == false){
          if(!$scope.searchRecents(parsed.feed.title.toLowerCase())){
            debounce = true;
            

            //If the podcast is indexed on itunes
            if(parsed.feed.itunes.image != undefined)
              $scope.imageUrl = parsed.feed.itunes.image;
            else
              $scope.imageUrl = "./res/thumbnails/Radiolab.jpg";



            $scope.author = parsed.feed.itunes.author;
            $scope.title = parsed.feed.title;
            $scope.description = parsed.feed.description;
            $scope.entries = parsed.feed.entries;



            //Add the new entry to the local database regardless if it's already there
            var new_entry = {
              'author': $scope.author,
              'description': $scope.description,
              'title': $scope.title,
              'url': text
            }
            $scope.local_database[$scope.title.toLowerCase()] = new_entry;





            $scope.recents.unshift({
              'title': $scope.title,
              'author': $scope.author,
              'imageUrl': $scope.imageUrl,
              'description': $scope.description,
              'entries': $scope.entries,
              'rssUrl': text
            });


            fs.writeFile('./saved-podcasts.txt',JSON.stringify($scope.recents), function(err){
              if(!err)
                console.log("saved");
            });
            $scope.$apply();
          }
        }
      });
    }
    //This was Itunes Search API, but I would definitely run into API limits
    /*else{
      request('https://itunes.apple.com/search?term=' + text + '&country=US&media=podcast',function(error,response,body){
        url = JSON.parse(body).results[0].feedUrl;
        console.log(JSON.parse(body));
        $scope.add(url);
      });
    }
    */
    debounce = false;
  }

});
