

import React from 'react';

import Controller from '../lib/controller';
import Center from '../views/center';


export default Controller.extend({


  channel: 'center',


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
      <Center />,
      document.getElementById('center')
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
