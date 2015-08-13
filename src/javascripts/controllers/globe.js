

import Controller from '../lib/controller';
import Globe from '../views/globe';
import world from '../data/world.geo.json';


export default Controller.extend({


  channel: 'globe',


  /**
   * Spin the globe.
   */
  initialize: function() {
    this.view = new Globe();
    this.view.drawGeoJSON(world);
    this.start();
  },


});
