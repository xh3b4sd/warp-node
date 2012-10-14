
var Warp = require("../index")
  , TestServer = require("./lib/test-server");

describe("Delaying Requests", function () {
  var warp, server;

  beforeEach(function () {
    warp = Warp.create({
      url: "GET http://localhost:8124/ping"
    });

    server = TestServer(function () {
      warp.activate();
    });
  });

  afterEach(function () {
    server.close();
  });

  it("should delay the request execution", function () {
    var start = Date.now();

    warp.request.delay = 100;

    warp.execute(function () {
      var duration = Date.now() - start;
      expect(duration).toBeGreaterThan(100);
    });
  });

  it("should not delay request execution", function () {
    var start = Date.now();

    warp.request.delay = 0;

    warp.execute(function () {
      var duration = Date.now() - start;
      expect(duration).toBeLessThan(100);
    });
  });
});

