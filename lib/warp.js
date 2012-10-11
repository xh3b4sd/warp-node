/**
 *
 * Warp modul.
 *
 */

var Request = require("./request").Request;

/**
 * Constructor.
 */
function Warp() {
  this.request = Request.createRequest();
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
Warp.createWarp = function createWarp() {
  return new Warp();
};

/**
 *
 * Prototype.
 *
 */

/**
 *
 */
Warp.prototype.get = function call(url, cb) {
  this.request.call("GET", url, cb);
};

