

import $ from 'jquery';
import React, { Component, findDOMNode } from 'react';

import Scene from '../scene/scene';
import Startup from '../scene/startup';
import Zoom from '../scene/zoom';
import Xray from '../scene/xray';

import { store } from '../';
import { startXray } from '../actions/xray';
import { showGPSError, showOrientationError } from '../actions/errors';
import { GPSError, OrientationError } from '../errors';


export default class extends Component {


  /**
   * Run the scene manager.
   */
  componentDidMount() {

    let scene = new Scene(findDOMNode(this.refs.scene));

    let startup = new Startup(scene);
    let zoom = new Zoom(scene);
    let xray = new Xray(scene);

    // Render scene.
    startup.start()

      // Zoom to location.
      .then(() => {
        return zoom.start();
      })

      // Start VR.
      .then(() => {
        return xray.start();
      })

      // Notify started.
      .then(() => {
        store.dispatch(startXray());
      })

      // No GPS.
      .catch(GPSError, err => {
        store.dispatch(showGPSError());
      })

      // No accelerometer.
      .catch(OrientationError, err => {
        store.dispatch(showOrientationError());
      });

  }


  /**
   * Render the scene container.
   */
  render() {
    return <div id="scene" ref="scene"></div>
  }


}
