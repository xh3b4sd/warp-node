/**
 *
 * Options modul.
 *
 */

/**
 * Constructor.
 */
function Options() {
  this.repeat = 1;
  this.delay = 0;
  this.timeout = 0;
}

exports.Options = Options;

/**
 *
 * Public
 *
 */

/**
 * @return {Object}
 */
Options.createOptions = function createOptions() {
  return new Options();
};

