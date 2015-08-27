

import _ from 'lodash';
import rbush from 'rbush';

import labels from '../data/labels.json';
import View from '../lib/view';


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
    console.log(data);
  },


});
