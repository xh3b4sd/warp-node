
var http = require('http')
  , qs = require("querystring");

/**
 * Http server to test against.
 *
 * @param {Function} cb
 *
 * @return {Object}
 */
module.exports = function TestServer(cb) {
  var server = http.createServer();

  server.on("request", function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});

    if (req.method === "POST") {
      var data = "";

      req.on('data', function(chunk) {
        data += chunk;
      });

      req.on('end', function() {
        if (data === "some=data") {
          res.end("ok");
        } else {
          res.end("not ok");
        }
      });
    } else if (req.url === "/ping") {
      res.end("pong");
    }
  });

  server.on("error", function (err) {
    throw err;
  });

  server.listen("8124", function () {
    cb();
  });

  return server;
};

