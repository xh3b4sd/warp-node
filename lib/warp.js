/**
 *
 * Warp modul.
 *
 */

var _ = require("underscore")
  , Request = require("./request").Request;

/**
 * Constructor.
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
 *
 */
Warp.prototype.activate = function activate() {
  this.request.activate();
};

/**
 *
 */
Warp.prototype.execute = function execute(cb) {
  var self = this;

  self.request.execute(function (err, res, data) {
    cb(err, res, data);

    if (++self.request.repeated < self.request.repeat) {
      self.execute(cb);
    }
  });
};

