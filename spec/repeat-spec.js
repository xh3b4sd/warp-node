
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

  describe("2 times", function () {
    beforeEach(function () {
      warp.request.repeat = 2;
    });

    it("should respond without errors", function () {
      warp.execute(function (err, res, data) {
        expect(err).toBeUndefined();
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

  describe("5 times", function () {
    beforeEach(function () {
      warp.request.repeat = 5;
    });

    it("should respond without errors", function () {
      warp.execute(function (err, res, data) {
        expect(err).toBeUndefined();
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

  describe("10 times", function () {
    beforeEach(function () {
      warp.request.repeat = 10;
    });

    it("should respond without errors", function () {
      warp.execute(function (err, res, data) {
        expect(err).toBeUndefined();
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
});

