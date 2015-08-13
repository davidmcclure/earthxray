

import _ from 'lodash';
import Radio from 'backbone.radio';
import Backbone from 'backbone';


export default Backbone.View.extend({


  /**
   * Connect to channels.
   */
  constructor: function() {
    this._initChannels();
    Backbone.View.apply(this, arguments);
  },


  /**
   * Connect to channels listed under the `channels` key.
   */
  _initChannels: function() {

    // Halt if no channels.
    if (!_.isArray(this.channels)) return;

    var channels = {};

    // Connect to channels.
    for (let name of this.channels) {
      channels[name] = Radio.channel(name);
    }

    // Replace the array.
    this.channels = channels;

  },


});
