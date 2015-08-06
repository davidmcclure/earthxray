

import * as opts from './opts.yml';


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
 * @param {Number} r
 * @returns {Array} - [X, Y, Z]
 */
export function lonLatToXYZ(lon, lat, r=opts.earth.radius) {

  // Degrees -> radians.
  let rLon = this.degToRad(lon);
  let rLat = this.degToRad(lat);

  // Coordinates -> X/Y/Z.
  let x = -r * Math.cos(rLat) * Math.cos(rLon);
  let z =  r * Math.cos(rLat) * Math.sin(rLon);
  let y =  r * Math.sin(rLat);

  return [x, y, z];

};
