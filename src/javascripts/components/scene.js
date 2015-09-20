

import $ from 'jquery';
import React, { Component, findDOMNode } from 'react';

import Scene from '../scene/scene';
import Startup from '../scene/startup';
import Zoom from '../scene/zoom';
import Xray from '../scene/xray';


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
        xray.start();
      });

  }


  /**
   * Render the scene container.
   */
  render() {
    return <div id="scene" ref="scene"></div>
  }


}
