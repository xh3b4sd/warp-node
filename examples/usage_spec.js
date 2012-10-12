
/**
 *
 * Test server to test against
 *
 */

function startServer(cb) {
  var server = require('http').createServer(function (request, response) {
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.end("pong");
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

var Warp = require("../index.js");      // normaly just do require("warp")

describe("Request", function () {
  var warp, server;

  beforeEach(function () {
    warp = Warp.create({
      url: "GET http://localhost:8124", // test that url
      repeat: 10,                       // repeat the test 10 times
      delay: 200                        // delay each test 200 ms
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
    warp.request.url = "GET http://localhost:8124";

    warp.execute(function (err, res, data) {
      expect(res.statusCode).toBe(200);
    });
  });

  it("should respond with pong", function () {
    warp.request.delay = 500;

    warp.execute(function (err, res, data) {
      expect(data).toBe("pong");
    });
  });
});

