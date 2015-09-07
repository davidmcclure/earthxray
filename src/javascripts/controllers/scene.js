

import Controller from '../lib/controller';
import Scene from '../views/scene';
import Startup from '../views/startup';
import Zoom from '../views/zoom';
import Xray from '../views/xray';


export default Controller.extend({


  channel: 'scene',


  /**
   * Start the scene.
   */
  initialize: function() {

    let scene = new Scene();

    let startup = new Startup(scene);
    let zoom = new Zoom(scene);
    let xray = new Xray(scene);

    // Render scene.
    startup.start()

      // Zoom to location.
      .then(() => {
        return zoom.start();
      })

      // Start VR.
      .then(() => {
        xray.start();
      });

  },


});
