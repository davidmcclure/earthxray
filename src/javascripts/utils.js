

/**
 * Convert degrees to radians.
 *
 * @param {Number} degrees
 * @returns {Number}
 */
exports.degToRad = function(d) {
  return d * Math.PI / 180;
};


/**
 * Convert degrees to radians.
 *
 * @param {Number} lat
 * @param {Number} lon
 * @returns {Array} - [X, Y, Z]
 */
exports.latLonToXYZ = function(lat, lon) {

  // Degrees -> radians.
  var rLat = this.degToRad(lat);
  var rLon = this.degToRad(lon);

  // Coordinates -> X/Y/Z.
  var x = Math.cos(rLat) * Math.cos(rLon);
  var y = Math.cos(rLat) * Math.sin(rLon);
  var z = Math.sin(rLat);

  // TODO: Why?
  return [-x, z, y];

};
