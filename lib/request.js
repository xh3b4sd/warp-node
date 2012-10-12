/**
 *
 * Request modul.
 *
 */

var Url = require("url")
  , Http = require("http")
  , Https = require("https")
  , _ = require("underscore");

/**
 * Constructor.
 */
function Request(options) {
  this.url = options.url || "";
  this.repeat = options.repeat || 1;

  this.active = false;
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
Request.create = function create(options) {
  return new Request(options);
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
Request.prototype.activate = function activate() {
  this.active = true;
};

/**
 *
 */
Request.prototype.call = function call(callbackObject) {
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
Request.prototype.execute = function execute(cb) {
  var self = this
    , reqRun = false
    , reqRes = {}
    , reqData = ""
    , reqErr = undefined;

  _.delay(function () {
    self.call({
      setResponse: function (res) {
        reqRes = res;
      },
      setDataChunk: function (chunk) {
        reqData += chunk;
      },
      setError: function (err) {
        reqErr = err;
      },
      setRun: function () {
        reqRun = true;
      }
    });
  }, self.delay);

  waitsFor(function() {
    return reqRun;
  });

  runs(function () {
    cb(reqErr, reqRes, reqData);
  });
};

