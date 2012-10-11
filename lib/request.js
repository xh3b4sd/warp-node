/**
 *
 * Request modul.
 *
 */

var Url = require("url")
  , Http = require("http")
  , Https = require("https")

/**
 * Constructor.
 */
function Request() {
  this.port = "8124";
  this.encoding = 'utf8';
}

exports.Request = Request;

/**
 *
 * Public
 *
 */

/**
 * @return {Object}
 */
Request.createRequest = function createRequest() {
  return new Request();
};

/**
 *
 * Prototype.
 *
 */

/**
 * @return {String}
 */
Request.prototype.getMethod = function getMethod() {
  if (/^[A-Z]/.test(this.url)) {
    return this.url.split(" ")[0];
  }

  return "GET";
};

/**
 * @return {String}
 */
Request.prototype.getUrl = function getUrl() {
  var url = this.url;

  if (/^[A-Z]/.test(this.url)) {
    url = this.url.split(" ")[1];
  }

  return Url.parse(url, true);
};

/**
 * @return {Object}
 */
Request.prototype.getOptions = function getOptions() {
  var method = this.getMethod()
    , url = this.getUrl();

  return {
    host: url.hostname || "localhost",
    port: url.port || "80",
    path: url.path || "/",
    method: method
  };
};

/**
 *
 */
Request.prototype.process = function process(callbackObject) {
  var options = this.getOptions();

  var req = Http.get(options, function(res) {
    callbackObject.setResponse(res);

    res.setEncoding("utf8");

    res.on("data", function (chunk) {
      callbackObject.setDataChunk(chunk);
    });

    res.on("end", function () {
      callbackObject.setRun();
    });
  });

  req.on("error", function(err) {
    callbackObject.setRun();
    callbackObject.setError(err);
  });

  req.end();
};

/**
 * @param {Function} cb
 */
Request.prototype.call = function call(cb) {
  var reqRun, reqRes, reqData, reqErr;

  this.process({
    setResponse: function (res) {
      reqRes = res;
    },
    setDataChunk: function (chunk) {
      reqData = (reqData || "") + chunk;
    },
    setError: function (err) {
      reqErr = err;
    },
    setRun: function () {
      reqRun = true;
    }
  });

  waitsFor(function() {
    return reqRun;
  }, "Waits too long for request", 100);

  runs(function () {
    cb(reqErr, reqRes, reqData);
  });
};

