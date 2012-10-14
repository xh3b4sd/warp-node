
var Warp = require("../index")
  , TestServer = require("./lib/test-server");

describe("GET Requests", function () {
  var warp, server;

  beforeEach(function () {
    warp = Warp.create({
      url: "GET http://localhost:8124/ping",
    });

    server = TestServer(function () {
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

  it("should respond with pong", function () {
    warp.execute(function (err, res, data) {
      expect(data).toBe("pong");
    });
  });
});

