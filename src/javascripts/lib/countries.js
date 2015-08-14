

import turf from 'turf';
import knn from 'rbush-knn';
import rbush from 'rbush';

import * as utils from '../utils';


export default class Countries {


  /**
   * Set the GeoJSON.
   *
   * @param {Object} json
   */
  constructor(json) {

    this.json = json;
    this._indexPoints();

    let t1 = new Date();
    for (let i=0; i<10000; i++) {
      this.xyzToCountry(-1084.3465867499335, -2116.909066586136, 5910.374732925923);
    }
    let t2 = new Date();
    console.log(t2-t1);

  }


  /**
   * Index border points into an rtree.
   */
  _indexPoints() {

    let points = [];

    // Gather points into an array.
    for (let f of this.json.features) {

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

    this.tree = rbush(10, [
      '.minX',
      '.minY',
      '.maxX',
      '.maxY'
    ]);

    // Index the R tree.
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
  xyzToCountry(x, y, z) {

    // XYZ -> lon/lat.
    let [lon, lat] = utils.xyzToLonLat(x, y, z);

    let point = {
      geometry: {
        type: 'Point',
        coordinates: [lat, lon]
      }
    };

    // Get the 2 nearest points.
    let nn = knn(this.tree, [lat, lon], 20);

    let country = null;

    for (let n of nn) {
      if (turf.inside(point, n.feature)) {
        country = n.feature.properties.name;
        break;
      }
    }

    return country;

  }


}
