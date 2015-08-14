

import THREE from 'three';
import * as opts from './opts.yml';


/**
 * Convert lon/lat -> XYZ.
 *
 * @param {Number} lon
 * @param {Number} lat
 * @param {Number} r
 * @returns {Array} - [X, Y, Z]
 */
export function lonLatToXYZ(lon, lat, r=opts.earth.radius) {

  // Degrees -> radians.
  let rLon = THREE.Math.degToRad(lon);
  let rLat = THREE.Math.degToRad(lat);

  // Coordinates -> X/Y/Z.
  let x = -r * Math.cos(rLat) * Math.cos(rLon);
  let z =  r * Math.cos(rLat) * Math.sin(rLon);
  let y =  r * Math.sin(rLat);

  return [x, y, z];

};


/**
 * Convert XYZ -> lon/lat.
 *
 * @param {Number} x
 * @param {Number} y
 * @param {Number} z
 * @param {Number} r
 * @returns {Array} - [lon, lat]
 */
export function xyzToLonLat(x, y, z, r=opts.earth.radius) {

  let lon = THREE.Math.radToDeg(Math.asin(z/r));
  let lat = THREE.Math.radToDeg(Math.atan2(y, x));

  return [lon, lat];

};
