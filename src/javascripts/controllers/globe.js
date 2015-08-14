

import Controller from '../lib/controller';
import Globe from '../views/globe';


export default Controller.extend({


  channel: 'globe',


  /**
   * Spin the globe.
   */
  initialize: function() {
    this.view = new Globe();
    this.start();
  },


});
