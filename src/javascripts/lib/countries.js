

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

      // Link the feature with the point.
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

    // Get the 2 nearest points.
    let nn = knn(this.tree, [lat, lon], 2);

    let country = null;

    // Inside the first point's country?
    if (turf.inside(point, nn[0].feature)) {
      country = nn[0].feature.properties.name;
    }

    // If not, then the second point's?
    else if (turf.inside(point, nn[1].feature)) {
      country = nn[1].feature.properties.name;
    }

    return country;

  }


}
