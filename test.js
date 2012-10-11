
  var server = require('http').createServer(function (request, response) {
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.end("pong");
  });

  server.listen("8124", function () {
  });

