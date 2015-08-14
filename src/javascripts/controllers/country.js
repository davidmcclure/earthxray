

import React from 'react';
import Controller from '../lib/controller';
import Country from '../views/country';


export default Controller.extend({


  channel: 'country',


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
      <Country />,
      document.getElementById('country')
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
