var PORT = 9090;

var fs = require("fs");
var express  = require('express');
var app      = express();                               // create our app w/ express
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

// configuration =================
app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

// listen (start app with node server.js) ======================================
app.listen(PORT);
console.log("App listening on port " + PORT	);

app.post('/save', function(req, res){
  console.log('request body');
  var filename = req.body.filename;
  var content = req.body.data;

  fs.writeFile(filename, content, function(err){
    if(err != null){
      console.log(err);
      res.status(500).send();
    } else {
      res.status(200).send();
    }
  });
});

app.post('/create', function(req, res){
  var path = req.body.path;

  fs.writeFile(path, '', function(err){
    if(err != null){
      console.log(err);
      res.status(500).send();
    } else {
      res.status(200).send();
    }
  });
});

app.get('/open*', function(req, res){
  var path = req.originalUrl.substring(5);

  fs.open(path, 'r', function(status, fd) {
    var stats = fs.statSync(path);
    var fileSizeInBytes = stats["size"]

    var buffer = new Buffer(1024);
    fs.read(fd, buffer, 0, 1024, 0, function(err, bytesRead, buffer){
      var editable = fileSizeInBytes < 1024;
      var result = {
        'editable' : editable,
        'data' : buffer.toString("", 0, bytesRead)
      };

      res.json(result);
    });
  });



});

app.get('/path*', function(req, res){

  var path = req.originalUrl.substring(5);

  var contents = fs.readdirSync(path);

  var directories = [];
  var files = [];

  for(var i in contents){
    var content = contents[i];
    var contentPath = path + content;

    var stats = fs.lstatSync(contentPath);
    if(stats.isDirectory()){
      directories.push(content);
    } else {
      files.push(content);
    }
  }

  var result = {
    'directories': directories,
    'files': files
  };

  res.json(result);
});

app.get('*', function(req, res){
  res.sendfile('./public/index.html');
});
