

import * as utils from '../utils';


export default class Borders {


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
    let [lon, lat] = utils.xyzToLonLat(x, y, z);
    console.log(lon, lat);
  }


}
