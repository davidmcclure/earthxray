

import Controller from '../lib/controller';
import Scene from '../views/scene';
import Startup from '../views/startup';
import Xray from '../views/xray';


export default Controller.extend({


  channel: 'scene',


  /**
   * Spin the globe.
   */
  initialize: function() {
    let scene = new Scene();
    scene.runSteps([Startup, Xray]);
  },


});
