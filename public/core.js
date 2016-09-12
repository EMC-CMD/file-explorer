var fileExplorer = angular.module('fileExplorer', []);

function mainController($scope, $http){
  $scope.pwd = '/';
  $scope.filename = null;
  $scope.readonly = true;
  $scope.content = null;

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
  }

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
