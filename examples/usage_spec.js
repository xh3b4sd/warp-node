
/**
 *
 * Test server to test against
 *
 */

function startServer(cb) {
  var server = require('http').createServer(function (req, res) {
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

  server.listen("8124", function () {
    cb();
  });

  server.on("error", function (err) {
    throw err;
  });

  return server;
}

/**
 *
 * Usage
 *
 */

var Warp = require("../index.js")             // normaly just do require("warp")
  , qs = require("querystring");

describe("GET Requests", function () {
  var warp, server;

  beforeEach(function () {
    warp = Warp.create({
      url: "GET http://localhost:8124/ping",  // test that url
      repeat: 10,                             // repeat the test 10 times
      delay: 20                               // delay each test 20 ms
    });

    server = startServer(function () {
      warp.activate();
    });
  });

  afterEach(function () {
    server.close();
  });

  it("should not throw errors", function () {
    warp.request.repeat = 5;

    warp.execute(function (err, res, data) {
      expect(err).toBeUndefined();
    });
  });

  it("should respond with status code 200", function () {
    warp.request.url = "GET http://localhost:8124/ping";

    warp.execute(function (err, res, data) {
      expect(res.statusCode).toBe(200);
    });
  });

  it("should respond with pong", function () {
    warp.request.delay = 50;

    warp.execute(function (err, res, data) {
      expect(data).toBe("pong");
    });
  });
});

describe("POST Requests", function () {
  var warp, server;

  beforeEach(function () {
    warp = Warp.create({
      url: "POST http://localhost:8124",
      repeat: 10,
      delay: 20,
    });

    warp.request.data = qs.stringify({
      some: "data"
    });

    warp.request.headers = {
      "Content-Type": "application/json",
      "Content-Length": warp.request.data.length
    };

    server = startServer(function () {
      warp.activate();
    });
  });

  afterEach(function () {
    server.close();
  });

  it("should not throw errors", function () {
    warp.execute(function (err, res, data) {
      expect(err).toBeUndefined();
    });
  });

  it("should respond with status code 200", function () {
    warp.execute(function (err, res, data) {
      expect(res.statusCode).toBe(200);
    });
  });

  it("should respond with ok", function () {
    warp.execute(function (err, res, data) {
      expect(data).toBe("ok");
    });
  });
});

