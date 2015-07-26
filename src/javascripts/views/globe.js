

var Backbone = require('backbone');


module.exports = Backbone.View.extend({


  el: '#globe',


  /**
   * Start the globe.
   */
  initialize: function() {
    this._initSphere();
  },


  /**
   * DEV: Render a sphere for the earth.
   */
  _initSphere: function() {
    console.log('sphere');
  },


});
