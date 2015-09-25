

import $ from 'jquery';
import { connect } from 'react-redux';
import React, { Component, PropTypes } from 'react';
import THREE from 'three';
import Hammer from 'hammerjs';


@connect(state => ({
  location: state.scene.location
}))
export default class extends Component {


  static contextTypes = {
    world: PropTypes.object.isRequired,
    camera: PropTypes.object.isRequired,
    $el: PropTypes.object.isRequired,
  }


  /**
   * Mount the VR.
   */
  componentDidMount() {
    this.initializeHeading();
    this.drawCenterDot();
    this.listenForOrientation();
    this.listenForZoom();
    //this.listenForRender();
  }


  /**
   * Store the base orientation matrix.
   */
  initializeHeading() {

    let [x, y, z] = this.props.location;

    // Store the default heading.
    this.context.camera.lookAt(new THREE.Vector3(0, 0, 0));
    this.eye = this.context.camera.matrix.clone();

    // Compass north, winter in my blood.
    this.eye.lookAt(
      new THREE.Vector3(x, y, z),
      new THREE.Vector3(0, 0.001, 0),
      new THREE.Vector3(x, y, z).normalize()
    );

  }


  /**
   * Draw the 3d "center" dot.
   */
  drawCenterDot() {

    let light = new THREE.PointLight(0xffffff, 1, 0);

    let geometry = new THREE.SphereGeometry(30, 32, 32);

    let material = new THREE.MeshLambertMaterial({
      color: 0xff0000
    });

    this.dot = new THREE.Mesh(geometry, material);
    this.dot.visible = false;

    // Sync light with camera.
    light.position.copy(this.context.camera.position);
    this.context.world.add(this.dot, light);

  }


  /**
   * Bind to device orientation.
   */
  listenForOrientation() {

    if (window.DeviceOrientationEvent) {

      // Check for the accelerometer.
      $(window).bind('deviceorientation.check', e => {

        if (!e.originalEvent.alpha) {
          // TODO: Dispatch error.
        }

        $(window).unbind('deviceorientation.check');

      });

      // Save the orientation data.
      $(window).bind('deviceorientation', e => {
        this.orientation = e.originalEvent;
      });

    }

    else {
      // TODO: Dispatch error.
    }

  }


  /**
   * Pinch to zoom.
   */
  listenForZoom() {

    let el = this.context.$el.get(0);
    let gesture = new Hammer(el);

    // Enable pinch.
    gesture.get('pinch').set({ enable: true });

    let start;

    // Capture initial FOV.
    gesture.on('pinchstart', e => {
      start = this.context.camera.fov;
    });

    gesture.on('pinch', e => {

      // Break if we're out of bounds.
      let fov = start / e.scale;
      if (fov < 5 || fov > 120) return;

      // Apply the new FOV.
      this.context.camera.fov = fov;
      this.context.camera.updateProjectionMatrix();

    });

  }


  render() {
    return null;
  }


}
