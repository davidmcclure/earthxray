

import React from 'react';
import Controller from '../lib/controller';
import Country from '../views/country';


export default Controller.extend({


  channel: 'country',


  /**
   * Start the view.
   */
  initialize: function() {

    React.render(
      <Country />,
      document.getElementById('country')
    );

    this.start();

  },


});
