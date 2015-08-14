

import turf from 'turf';
import * as utils from '../utils';


export default class Countries {


  /**
   * Set the GeoJSON.
   *
   * @param {Object} json
   */
  constructor(json) {
    this.json = json;
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
