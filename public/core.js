var fileExplorer = angular.module('fileExplorer', []);

function mainController($scope, $http){
  $scope.pwd = '/';
  $scope.filename = null;
  $scope.readonly = true;
  $scope.content = null;
  $scope.showModal = false;
  $scope.newFilename = '';
  $scope.newDirName = '';

  $scope.loadPath = function(){
    var url = '/path' + $scope.pwd;
    $http.get(url)
      .success(function(data){
        $scope.directories = data.directories;
        $scope.files = data.files;
      })
      .error(function(data){
        alert('wtf?');
      });
  };

  $scope.changeDirectory = function(directory){
    console.log('directory = ' + directory);

    $scope.pwd = $scope.pwd + directory + '/';
    $scope.loadPath();
  };

  $scope.createNewDir = function(){
    console.log('$scope.newDirName = ' + $scope.newDirName);
    if($scope.newDirName != null && $scope.newDirName != ''){
      path = $scope.pwd + $scope.newDirName;
      var data = {
        'path': path
      };

      $http.post('/createDir', data)
        .success(function(res){
          $scope.changeDirectory($scope.newDirName);
          $scope.newDirName = '';
        })
        .error(function(){
          alert('wtf?');
        });
    }
  };

  $scope.createNewFile = function(){
    if($scope.newFilename != null && $scope.newFilename != ''){
      path = $scope.pwd + $scope.newFilename;
      var data = {
        'path': path
      }

      $http.post('/create', data)
        .success(function(res){
          $scope.openFile($scope.newFilename);
          $scope.loadPath();
          $scope.newFilename = '';
        })
        .error(function(){
          alert('wtf?');
        });
    }
  };

  $scope.upDirectory = function(){
    if($scope.pwd == '/'){
      return;
    } else {
      var newPath = $scope.pwd.substring(0, $scope.pwd.length	 - 1);
      var i = newPath.lastIndexOf('/');
      var newPath = newPath.substring(0, i) + '/';
      console.log('newPath = ' + newPath);

      $scope.pwd = newPath;
      $scope.loadPath();
    }
  };

  $scope.saveContent = function(){
    var data = {
      'filename' : $scope.filename,
      'data' : $scope.content
    }
    $http.post('/save', data)
      .success(function(res){
        alert('Save Successfully');
      })
      .error(function(){
        alert('wtf?');
      });
  };

  $scope.openFile = function(file){
    var filename = $scope.pwd + file;
    var url = '/open' + filename;
    console.log('url = ' + url);

    $scope.filename = filename;
    $scope.editableContent = null;
    $scope.content = null;

    $http.get(url)
      .success(function(res){
        console.log('res = ');
        console.log(res);
        $scope.readonly = !res.editable;
        $scope.content = res.data;
      })
      .error(function(data){
        alert('wtf?');
      });
  }
}
