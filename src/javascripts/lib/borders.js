

import turf from 'turf';
import knn from 'rbush-knn';
import rbush from 'rbush';

import * as utils from '../utils';


export default class Borders {


  /**
   * Initialize the rtree.
   */
  constructor() {
    this.tree = rbush(10, [
      '.minX',
      '.minY',
      '.maxX',
      '.maxY'
    ]);
  }


  /**
   * Index GeoJSON features.
   *
   * @param {Array} features
   */
  indexFeatures(features) {

    let points = [];

    // Gather points into an array.
    for (let f of features) {

      let coords = [];

      switch (f.geometry.type) {

        case 'Polygon':
          coords.push.apply(coords, f.geometry.coordinates[0]);
        break;

        case 'MultiPolygon':
          for (let [polygon] of f.geometry.coordinates) {
            coords.push.apply(coords, polygon);
          }
        break;

      }

      // Link the points with features.
      for (let c of coords) {
        points.push({
          minX: c[0],
          minY: c[1],
          maxX: c[0],
          maxY: c[1],
          feature: f,
        });
      }

    }

    this.tree.load(points);

  }


  /**
   * Given an XYZ coordinate, try to find a country that contains it.
   *
   * @param {Number} x
   * @param {Number} y
   * @param {Number} z
   * @return {String}
   */
  query(x, y, z) {

    // XYZ -> lon/lat.
    let [lon, lat] = utils.xyzToLonLat(x, y, z);

    let point = {
      geometry: {
        type: 'Point',
        coordinates: [lon, lat]
      }
    };

    // Get the N nearest points.
    let nn = knn(this.tree, [lon, lat], 20);
    let country = null;

    // Probe for a parent country.
    for (let n of nn) {
      if (turf.inside(point, n.feature)) {
        country = n.feature;
        break;
      }
    }

    return country;

  }


}
