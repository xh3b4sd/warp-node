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
 *
 * @param {Object} options
 */
function Request(options) {
  this.url = options.url || "";
  this.data = options.data || "";
  this.encoding = options.encoding || "utf8";
  this.resEncoding = options.resEncoding || "utf8";

  this.repeat = options.repeat || 1;
  this.delay = options.delay || 0;

  this.headers = options.headers || {};

  this.repeated = 0;

  this.active = false;

  this.protocols = {
    "http:": Http,
    "https:": Https
  };
}

exports.Request = Request;

/**
 *
 * Public
 *
 */

/**
 * @param {Object} options
 *
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
  var url = this.getUrl();

  return {
    host: url.hostname || "localhost",
    port: url.port || "80",
    path: url.path || "/",

    method: this.getMethod(),

    headers: this.headers
  };
};

/**
 * See Warp.prototype.activate(). The request need to be activated to start
 * the test.
 */
Request.prototype.activate = function activate() {
  this.active = true;
};

/**
 * @param {Object} callbackObject
 */
Request.prototype.call = function call(callbackObject) {
  var self = this
    , protocol = self.getUrl().protocol
    , options = self.getOptions();

  var req = self.protocols[protocol].get(options, function(res) {
    callbackObject.setResponse(res);

    res.setEncoding(self.resEncoding);

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

  if (!_.isEmpty(self.data)) {
    req.write(self.data, self.encoding);
  }

  req.end();
};

/**
 * Execute a request and delay each of it, if wished. Here we encapsulated
 * jasmine´s asynchronous support.
 *
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

