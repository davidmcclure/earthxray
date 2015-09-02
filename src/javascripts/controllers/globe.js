

import Controller from '../lib/controller';
import Scene from '../views/scene';
import Startup from '../views/startup';


export default Controller.extend({


  channel: 'globe',


  /**
   * Spin the globe.
   */
  initialize: function() {

    let scene = new Scene();

    // TODO|dev
    let startup = new Startup(scene);
    startup.start();

  },


});
