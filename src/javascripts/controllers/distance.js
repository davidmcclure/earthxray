

import React from 'react';

import Controller from '../lib/controller';
import Distance from '../views/distance';


export default Controller.extend({


  channel: 'distance',


  events: {
    globe: {
      trace: 'onTrace'
    }
  },


  /**
   * Start the view.
   */
  initialize: function() {

    this.view = React.render(
      <Distance />,
      document.getElementById('distance')
    );

    this.start();

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
