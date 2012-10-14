
var Warp = require("../index")
  , TestServer = require("./lib/test-server");

describe("Repeating Requests", function () {
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

  it("should repeat requests 2 times", function () {
    warp.request.repeat = 2;

    warp.execute(function (dataForCalls) {
      expect(dataForCalls.length).toBe(warp.request.repeat);
    });
  });

  it("should repeat requests 5 times", function () {
    warp.request.repeat = 5;

    warp.execute(function (dataForCalls) {
      expect(dataForCalls.length).toBe(warp.request.repeat);
    });
  });

  it("should repeat requests 10 times", function () {
    warp.request.repeat = 10;

    warp.execute(function (dataForCalls) {
      expect(dataForCalls.length).toBe(warp.request.repeat);
    });
  });
});

