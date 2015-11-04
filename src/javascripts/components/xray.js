

import _ from 'lodash';
import $ from 'jquery';
import { connect } from 'react-redux';
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import THREE from 'three';
import Promise from 'bluebird';
import Hammer from 'hammerjs';

import Orientation from '../lib/orientation';
import mats from './materials.yml';
import * as xrayActions from '../actions/xray';
import * as errorActions from '../actions/errors';
import * as events from '../events/xray';


@connect(

  state => ({
    location: state.scene.location
  }),

  dispatch => {
    return bindActionCreators({
      ...xrayActions,
      ...errorActions,
    }, dispatch);
  }

)
export default class extends Component {


  static contextTypes = {
    world:  PropTypes.object.isRequired,
    camera: PropTypes.object.isRequired,
    $el:    PropTypes.object.isRequired,
    events: PropTypes.object.isRequired,
  }


  /**
   * Mount the VR.
   */
  componentDidMount() {

    Promise.all([
      this.initializeHeading(),
      this.drawCenterDot(),
      this.listenForOrientation(),
      this.listenForZoom(),
    ])

    .then(() => {
      this.listenForRender();
      this.props.startXray();
    });

  }


  /**
   * Store the base heading matrix.
   */
  initializeHeading() {

    let [x, y, z] = this.props.location;

    this.down = new THREE.Matrix4();

    this.down.lookAt(
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

    let material = new THREE.MeshLambertMaterial(mats.dot);

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

    return new Promise(resolve => {

      let orientation = new Orientation();

      orientation.on('supported', () => {
        this.orientation = orientation;
        resolve();
      });

      orientation.on('unsupported', () => {
        this.props.showOrientationError();
      });

      orientation.start();

    });

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
      this.props.zoomXray();
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


  /**
   * Orient the camera on render.
   */
  listenForRender() {

    this.context.events.on('render', () => {
      this.point();
      this.trace();
    });

  }


  // ** Render loop:


  /**
   * Point the camera.
   */
  point() {

    // Look down.
    let heading = this.down.clone();

    // Apply the device orientation.
    let rotation = this.orientation.getRotationMatrix();
    heading.multiply(rotation);

    // Update the camera.
    this.context.camera.quaternion.setFromRotationMatrix(heading);

  }


  /**
   * Trace the far-side intersection point.
   */
  trace() {

    let camera = this.context.camera;

    // Get the heading vector.
    let heading = new THREE.Vector3(0, 0, -1);
    heading.applyQuaternion(camera.quaternion);

    // Get the scaling factor.
    let a = heading.dot(heading);
    let b = 2 * heading.dot(camera.position);
    let u = (-2*b) / (2*a);

    let distance;

    // Looking down.
    if (u > 0) {

      heading.multiplyScalar(u);

      // Get far-side intersection.
      let c = camera.position.clone().add(heading);
      distance = camera.position.distanceTo(c);

      // Update center dot.
      this.dot.position.copy(c);
      this.dot.visible = true;

    }

    // Looking into space.
    else {
      this.dot.visible = false;
    }

    events.traceCenter(distance);

  }


  render() {
    return null;
  }


}
