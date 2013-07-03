var Warp = require("../index")
  , TestServer = require("./lib/test-server");

describe("POST Requests", function () {
  var warp, server;

  beforeEach(function () {
    warp = Warp.create({
      url: "POST http://localhost:8124",
    });

    warp.request.data = {
      some: "data"
    };

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

  it("should respond with \"ok\"", function () {
    warp.execute(function (err, res, data) {
      expect(data).toBe("ok");
    });
  });

  it("should respond with \"not ok\" if wrong data was send", function () {
    warp.request.data = {
      some: "wrong data"
    };

    warp.execute(function (err, res, data) {
      expect(data).toBe("not ok");
    });
  });
});

