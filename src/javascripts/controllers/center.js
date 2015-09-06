

import React from 'react';

import Controller from '../lib/controller';
import Center from '../views/center';
import {waitOnce} from '../utils';


export default Controller.extend({


  channel: 'center',


  events: {
    xray: {
      trace: 'onTrace'
    }
  },


  /**
   * Start the view.
   */
  initialize: function() {

    // Wait for the VR to start.
    waitOnce('xray', 'start').then(() => {

      this.view = React.render(
        <Center />,
        document.getElementById('center')
      );

      this.start();

    });

  },


  /**
   * When the camera moves.
   *
   * @param {Object} data
   */
  onTrace: function(data) {
    this.view.setState(data);
  },


});
