

import Controller from '../lib/controller';
import Scene from '../views/scene';
import Startup from '../views/startup';
import Xray from '../views/xray';


export default Controller.extend({


  channel: 'scene',


  /**
   * Start the scene.
   */
  initialize: function() {

    let scene = new Scene();

    let startup = new Startup(scene);
    let xray = new Xray(scene);

    startup.start().then(() => {
      xray.start();
    });

  },


});
