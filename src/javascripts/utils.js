

/**
 * Convert degrees to radians.
 *
 * @param {Number} degrees
 * @returns {Number}
 */
export function degToRad(d) {
  return d * Math.PI / 180;
};


/**
 * Convert degrees to radians.
 *
 * @param {Number} lon
 * @param {Number} lat
 * @returns {Array} - [X, Y, Z]
 */
export function lonLatToXYZ(lon, lat) {

  // Degrees -> radians.
  var rLon = this.degToRad(lon);
  var rLat = this.degToRad(lat);

  // Coordinates -> X/Y/Z.
  var x = Math.cos(rLat) * Math.cos(rLon);
  var y = Math.cos(rLat) * Math.sin(rLon);
  var z = Math.sin(rLat);

  // TODO: Why?
  return [-x, z, y];

};
