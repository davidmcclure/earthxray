

import turf from 'turf';
import * as utils from '../utils';
import rbush from 'rbush';
import knn from 'rbush-knn';


export default class Countries {


  /**
   * Set the GeoJSON.
   *
   * @param {Object} json
   */
  constructor(json) {
    this.json = json;
    this._indexPoints();
  }


  /**
   * Index border points into an rtree.
   */
  _indexPoints() {

    let points = [];

    // Gather points into a single array.
    for (let {
      geometry: {
        coordinates: coords,
        type: type
      }
    } of this.json.features) {
      switch (type) {

        case 'Polygon':
          points.push.apply(points, coords[0]);
        break;

        case 'MultiPolygon':
          for (let [polygon] of coords) {
            points.push.apply(points, polygon);
          }
        break;

      }
    }

    // XY -> XYXY.
    for (let p of points) {
      p.push.apply(p, p);
    }

    // Index the R tree.
    this.tree = rbush();
    this.tree.load(points);

  }


  /**
   * Given a XYZ coordinate, try to find a country that contains it.
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

    let country = null;

    // Probe for match.
    // TODO: Slow. How to optimize?
    for (let c of this.json.features) {
      if (turf.inside(point, c)) {
        country = c.properties.name;
        break;
      }
    }

    return country;

  }


}
