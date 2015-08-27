

import Controller from '../lib/controller';
import Labels from '../views/labels';


export default Controller.extend({


  channel: 'labels',


  events: {
    globe: {
      trace: 'onTrace'
    }
  },


  /**
   * Start the view.
   */
  initialize: function() {
    this.view = new Labels();
    this.start();
  },


  /**
   * When the camera moves.
   *
   * @param {Object} data
   */
  onTrace: function(data) {
    this.view.render(data);
  },


});
