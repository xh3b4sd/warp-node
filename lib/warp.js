/**
 *
 * Warp modul.
 *
 */

var _ = require("underscore")
  , Request = require("./request").Request;

/**
 * Constructor.
 *
 * @param {Object} options
 */
function Warp(options) {
  var self = this;

  self.request = Request.create(options);

  waitsFor(function () {
    return self.request.active;
  });
}

exports.Warp = Warp;

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
Warp.create = function create(options) {
  return new Warp(options || {});
};

/**
 *
 * Prototype.
 *
 */

/**
 * The warp have to activate the request. May there have a server to be
 * started. If the server is ready, we can activate the request and
 * start the test.
 */
Warp.prototype.activate = function activate() {
  this.request.activate();
};

/**
 * Execute the warp. Here we encapsulated the recursion of request calls
 * that have to be executed iteratively.
 *
 * @param {Function} cb
 */
Warp.prototype.execute = function execute(cb) {
  var self = this
    , repeated = 0
    , errForCalls = []
    , resForCalls = []
    , dataForCalls = [];

  function recursion() {
    self.request.execute(function (err, res, data) {
      if (self.request.repeat === 1) {
        return cb(err, res, data);
      }

      errForCalls.push(err);
      resForCalls.push(res);
      dataForCalls.push(data);

      if (++repeated < self.request.repeat) {
        return recursion();
      }

      cb(errForCalls, resForCalls, dataForCalls);
    });
  }

  recursion();
};

