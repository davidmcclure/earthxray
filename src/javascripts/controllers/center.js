

import React from 'react';

import Controller from '../lib/controller';
import Center from '../views/center';


export default Controller.extend({


  channel: 'center',


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


});
