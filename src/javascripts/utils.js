

import _ from 'lodash';
import Radio from 'backbone.radio';
import THREE from 'three';
import opts from './opts.yml';


/**
 * Map action types to handlers.
 *
 * @param {Object} initialState
 * @param {Object} handlers
 */
export function createReducer(initialState, handlers) {
  return (state = initialState, action) => {

    // If a handler is provided for the current action, apply the reducer
    // and merge the result with the initial state.

    if (_.has(handlers, action.type)) {
      return {
        ...state,
        ...handlers[action.type](state, action),
      };
    }

    // Otherwise, return the intial state.

    else {
      return state;
    }

  };
}


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
 * Trace out a circle geometry.
 *
 * @param {Number} segments
 * @param {Number} axis
 * @param {Number} r
 * @returns {THREE.Geometry}
 */
export function drawCircle(segments, axis, r) {

  let geometry = new THREE.Geometry();

  _.times(segments+1, i => {

    let theta = (i / segments) * Math.PI * 2;

    let point;
    switch (axis) {

      case 'x':
        point = new THREE.Vector3(
          0,
          Math.cos(theta) * r,
          Math.sin(theta) * r
        );
      break;

      case 'y':
        point = new THREE.Vector3(
          Math.cos(theta) * r,
          0,
          Math.sin(theta) * r
        );
      break;

      case 'z':
        point = new THREE.Vector3(
          Math.cos(theta) * r,
          Math.sin(theta) * r,
          0
        );
      break;

    }

    geometry.vertices.push(point);

  });

  return geometry;

};


/**
 * Draw a longitude ring.
 *
 * @param {Number} degrees
 * @returns {THREE.Geometry}
 */
export function drawLonRing(degrees) {

  let rDeg = THREE.Math.degToRad(degrees);

  let geometry = drawCircle(
    100,
    'z',
    opts.earth.radius
  );

  // Spin the ring.
  let shift = new THREE.Matrix4();
  shift.makeRotationY(rDeg);
  geometry.applyMatrix(shift);

  return geometry;

};


/**
 * Draw a latitude ring.
 *
 * @param {Number} degrees
 * @returns {THREE.Geometry}
 */
export function drawLatRing(degrees) {

  let rDeg = THREE.Math.degToRad(degrees);

  let offset = Math.sin(rDeg) * opts.earth.radius;
  let radius = Math.cos(rDeg) * opts.earth.radius;

  let geometry = drawCircle(
    100,
    'y',
    radius
  );

  // Move up/down.
  let shift = new THREE.Matrix4();
  shift.setPosition(new THREE.Vector3(0, offset, 0));
  geometry.applyMatrix(shift);

  return geometry;

};


/**
 * Merge a set of line segments.
 *
 * @param {Array} segments
 * @returns {THREE.Geometry}
 */
export function mergeLines(segments) {

  let geometry = new THREE.Geometry();

  for (let s of segments) {

    // Add 1-2, 2-3, 3-4, etc.
    _.times(s.vertices.length-1, i => {
      let pair = s.vertices.slice(i, i+2);
      geometry.vertices.push(pair[0], pair[1]);
    });

  }

  return geometry;

};


/**
 * Calculate the Haversine distance between two coordinates.
 *
 * http://www.movable-type.co.uk/scripts/latlong.html
 *
 * @param {Number} lon1
 * @param {Number} lat1
 * @param {Number} lon2
 * @param {Number} lat2
 */
export function angularDistance(lon1, lat1, lon2, lat2) {

  let φ1 = THREE.Math.degToRad(lat1);
  let φ2 = THREE.Math.degToRad(lat2);

  let Δφ = THREE.Math.degToRad(lat2-lat1);
  let Δλ = THREE.Math.degToRad(lon2-lon1);

  let a = Math.sin(Δφ/2) *
          Math.sin(Δφ/2) +
          Math.cos(φ1) *
          Math.cos(φ2) *
          Math.sin(Δλ/2) *
          Math.sin(Δλ/2);

  return 2 * Math.atan2(
    Math.sqrt(a),
    Math.sqrt(1-a)
  );

};


/**
 * Get the coordinates of the point that lies at a given fraction of the
 * spherical distance between two points.
 *
 * http://williams.best.vwh.net/avform.htm#Intermediate
 *
 * @param {Number} lon1
 * @param {Number} lat1
 * @param {Number} lon2
 * @param {Number} lat2
 * @param {Number} r
 * @param {Number} f
 */
export function intermediatePoint(lon1, lat1, lon2, lat2, f) {

  let δ = angularDistance(lon1, lat1, lon2, lat2);

  let φ1 = THREE.Math.degToRad(lat1);
  let φ2 = THREE.Math.degToRad(lat2);

  let λ1 = THREE.Math.degToRad(lon1);
  let λ2 = THREE.Math.degToRad(lon2);

  let a = Math.sin((1-f)*δ) / Math.sin(δ);
  let b = Math.sin(f*δ) / Math.sin(δ);

  let x = (a * Math.cos(φ1) * Math.cos(λ1)) +
          (b * Math.cos(φ2) * Math.cos(λ2));

  let y = (a * Math.cos(φ1) * Math.sin(λ1)) +
          (b * Math.cos(φ2) * Math.sin(λ2));

  let z = (a * Math.sin(φ1)) +
          (b * Math.sin(φ2));

  let lon = Math.atan2(y, x);
  let lat = Math.atan2(z, Math.sqrt(x*x + y*y));

  let dLon = THREE.Math.radToDeg(lon);
  let dLat = THREE.Math.radToDeg(lat);

  return [dLon, dLat];

};


/**
 * Given two coordinates, compute the compass bearing from the first point
 * along the great-circle path to the second point.
 *
 * http://www.movable-type.co.uk/scripts/latlong.html#bearing
 *
 * @param {Number} lon1
 * @param {Number} lat1
 * @param {Number} lon2
 * @param {Number} lat2
 */
export function bearing(lon1, lat1, lon2, lat2) {

  let φ1 = THREE.Math.degToRad(lat1);
  let φ2 = THREE.Math.degToRad(lat2);

  let λ1 = THREE.Math.degToRad(lon1);
  let λ2 = THREE.Math.degToRad(lon2);

  let y = Math.sin(λ2-λ1) * Math.cos(φ2);

  let x = (Math.cos(φ1) * Math.sin(φ2)) -
          (Math.sin(φ1) * Math.cos(φ2) * Math.cos(λ2-λ1));

  let b = THREE.Math.radToDeg(Math.atan2(y, x));
  return (b + 360) % 360;

};
