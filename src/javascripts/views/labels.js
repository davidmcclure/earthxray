

import _ from 'lodash';
import knn from 'rbush-knn';
import rbush from 'rbush';

import labels from '../data/labels.json';
import View from '../lib/view';
import * as utils from '../utils';


export default View.extend({


  el: '#labels',


  /**
   * Index the r-tree.
   */
  initialize: function() {

    let points = _.map(labels, p => {
      return {
        minX: p.lon,
        minY: p.lat,
        maxX: p.lon,
        maxY: p.lat,
        country: p
      };
    });

    this.tree = rbush(10, [
      '.minX',
      '.minY',
      '.maxX',
      '.maxY',
    ]);

    this.tree.load(points);

  },


  /**
   * Render the labels.
   *
   * @param {Object} data
   */
  render: function(data) {

    // Get the center lon/lat.
    let [x, y, z] = data.point.toArray();
    let [lon, lat] = utils.xyzToLonLat(x, y, z);

    let nn = knn(this.tree, [lon, lat], 50);

  },


});
