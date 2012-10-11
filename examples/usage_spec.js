
var Warp = require("../index.js");

describe("Request", function () {
  var warp, server, run;

  beforeEach(function () {
    warp = Warp.createWarp();
  });

  it("should respond", function () {
    warp.request.url = "GET http://localhost:8124";

    warp.request.call(function (err, res, data) {
      expect(err).toBeUndefined();
      expect(res.statusCode).toBe(200);
      expect(data).toBe("pong");
    });
  });
});

