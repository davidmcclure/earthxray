

import React from 'react';
import Controller from '../lib/controller';
import { waitOnce } from '../utils';
import Center from '../views/center';


export default class extends Controller {


  static channelName = 'center';


  static events = {
    xray: {
      trace: 'onTrace'
    }
  };


  /**
   * Start the view.
   */
  constructor() {

    super();

    // Wait for the VR to start.
    waitOnce('xray', 'start').then(() => {

      this.view = React.render(
        <Center />,
        document.getElementById('center')
      );

      this.start();

    });

  }


  /**
   * When the camera moves.
   *
   * @param {Object} data
   */
  onTrace(data) {
    this.view.setState(data);
  }


};
