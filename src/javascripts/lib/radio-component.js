

import _ from 'lodash';
import React, { Component } from 'react';
import Radio from 'backbone.radio';


export default class extends Component {


  /**
   * Bind local channel, initialize.
   *
   * @param {Object} props
   */
  constructor(props) {
    super(props);
    this._bindEvents();
  }


  /**
   * Bind event mappings.
   */
  _bindEvents() {

    this._eventChannels = [];

    _.each(this.constructor.events, (bindings, channelName) => {

      // Connect to channel.
      let channel = Radio.channel(channelName);

      // Bind events -> callbacks.
      _.each(bindings, (method, event) => {
        channel.on(event, this[method], this);
      });

      this._eventChannels.push(channel);

    });

  }


  /**
   * Clean up event listeners.
   */
  componentWillUnmount() {

    for (let c of this._eventChannels) {
      c.off(null, null, this);
    }

  }


  render() {
    return null;
  }


}
