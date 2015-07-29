

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
  let rLon = this.degToRad(lon);
  let rLat = this.degToRad(lat);

  // Coordinates -> X/Y/Z.
  let x = Math.cos(rLat) * Math.cos(rLon);
  let y = Math.cos(rLat) * Math.sin(rLon);
  let z = Math.sin(rLat);

  // TODO: Why?
  return [-x, z, y];

};
