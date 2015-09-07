

import _ from 'lodash';
import Radio from 'backbone.radio';
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

  // XYZ -> lon/lat.
  let lon = Math.atan2(z, -x);
  let lat = Math.asin(y/r);

  // Radians -> degrees.
  let dLon = THREE.Math.radToDeg(lon);
  let dLat = THREE.Math.radToDeg(lat);

  return [dLon, dLat];

};


/**
 * Convert kilometers -> miles.
 *
 * @param {Number} km
 * @returns {Number}
 */
export function kmToMi(km) {
  return km*0.62137;
};


/**
 * Make a geometry from an array of lon/lats.
 *
 * @param {Array} lonlats
 * @returns {THREE.Geometry}
 */
export function lonLatsToGeom(lonlats) {

  let geometry = new THREE.Geometry();

  for (let [lon, lat] of lonlats) {
    let [x, y, z] = lonLatToXYZ(lon, lat);
    geometry.vertices.push(new THREE.Vector3(x, y, z));
  }

  return geometry;

};


/**
 * Convert a GeoJSON feature into an array of geometries.
 *
 * @param {Object} feature
 * @returns {Array} - [THREE.Geometry, ...]
 */
export function featureToGeoms(feature) {

  let coords = feature.geometry.coordinates;

  let geoms = []
  switch (feature.geometry.type) {

    case 'Polygon':
      geoms.push(lonLatsToGeom(coords[0]));
    break;

    case 'MultiPolygon':
      for (let [polygon] of coords) {
        geoms.push(lonLatsToGeom(polygon));
      }
    break;

  }

  return geoms;

};


/**
 * Wait for a backbone.radio event to fire.
 *
 * @param {String} channel
 * @param {String} event
 * @returns {Promise}
 */
export function waitOnce(channel, event) {
  return new Promise((resolve, reject) => {
    Radio.channel(channel).once(event, resolve);
  });
};


/**
 * Trace out a circle geometry.
 *
 * @param {Number} segments
 * @param {Number} radius
 * @returns {THREE.Geometry}
 */
export function drawCircle(segments, radius) {

  let geometry = new THREE.Geometry();

  _.times(segments+1, i => {

    let theta = (i / segments) * Math.PI * 2;

    geometry.vertices.push(new THREE.Vector3(
      Math.cos(theta) * radius,
      Math.sin(theta) * radius,
      0
    ));

  });

  return geometry;

};
