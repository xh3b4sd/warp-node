
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

  describe("1 times", function () {
    beforeEach(function () {
      warp.request.repeat = 1;
    });

    it("should respond without errors", function () {
      warp.execute(function (err, res, data) {
        expect(err).toEqual(undefined);
      });
    });

    it("should respond with status code 200", function () {
      warp.execute(function (err, res, data) {
        expect(res.statusCode).toEqual(200);
      });
    });

    it("should respond with 'pong'", function () {
      warp.execute(function (err, res, data) {
        expect(data).toEqual("pong");
      });
    });
  });

  describe("2 times", function () {
    beforeEach(function () {
      warp.request.repeat = 2;
    });

    it("should respond without errors", function () {
      warp.execute(function (errForCalls, resForCalls, dataForCalls) {
        expect(errForCalls.length).toEqual(2);
        expect(errForCalls).toEqual([ undefined, undefined ]);
      });
    });

    it("should respond with status code 200", function () {
      warp.execute(function (errForCalls, resForCalls, dataForCalls) {
        expect(resForCalls.length).toEqual(2);
        expect(resForCalls.map(function (res) { return res.statusCode; })).toEqual([ 200, 200 ]);
      });
    });

    it("should respond with 'pong'", function () {
      warp.execute(function (errForCalls, resForCalls, dataForCalls) {
        expect(dataForCalls.length).toEqual(2);
        expect(dataForCalls).toEqual([ "pong", "pong" ]);
      });
    });
  });

  describe("5 times", function () {
    beforeEach(function () {
      warp.request.repeat = 5;
    });

    it("should respond without errors", function () {
      warp.execute(function (errForCalls, resForCalls, dataForCalls) {
        expect(errForCalls.length).toEqual(5);
        expect(errForCalls).toEqual([ undefined, undefined, undefined, undefined, undefined ]);
      });
    });

    it("should respond with status code 200", function () {
      warp.execute(function (errForCalls, resForCalls, dataForCalls) {
        expect(resForCalls.length).toEqual(5);
        expect(resForCalls.map(function (res) { return res.statusCode; })).toEqual([ 200, 200, 200, 200, 200 ]);
      });
    });

    it("should respond with 'pong'", function () {
      warp.execute(function (errForCalls, resForCalls, dataForCalls) {
        expect(dataForCalls.length).toEqual(5);
        expect(dataForCalls).toEqual([ "pong", "pong", "pong", "pong", "pong" ]);
      });
    });
  });
});

