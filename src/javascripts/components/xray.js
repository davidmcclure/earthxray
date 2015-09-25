

import $ from 'jquery';
import { connect } from 'react-redux';
import React, { Component, PropTypes } from 'react';
import THREE from 'three';
import Hammer from 'hammerjs';

import * as actions from '../actions/xray';


@connect(
  state => ({
    location: state.scene.location
  }),
  actions
)
export default class extends Component {


  static contextTypes = {
    world: PropTypes.object.isRequired,
    camera: PropTypes.object.isRequired,
    $el: PropTypes.object.isRequired,
    events: PropTypes.object.isRequired,
  }


  /**
   * Mount the VR.
   */
  componentDidMount() {
    this.initializeHeading();
    this.drawCenterDot();
    this.listenForOrientation();
    this.listenForZoom();
    this.listenForRender();
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

    if (!this.orientation || !this.eye) return;

    let a = THREE.Math.degToRad(this.orientation.alpha);
    let b = THREE.Math.degToRad(this.orientation.beta);
    let g = THREE.Math.degToRad(this.orientation.gamma);

    let ra = new THREE.Matrix4();
    let rb = new THREE.Matrix4();
    let rg = new THREE.Matrix4();

    ra.makeRotationZ(a);
    rb.makeRotationX(b);
    rg.makeRotationY(g);

    let r = this.eye.clone();
    r.multiply(ra);
    r.multiply(rb);
    r.multiply(rg);

    this.context.camera.quaternion.setFromRotationMatrix(r);

  }


  /**
   * Trace the far-side intersection point.
   */
  trace() {

    let camera = this.context.camera;

    // Heading vector.
    let heading = new THREE.Vector3(0, 0, -1);
    heading.applyQuaternion(camera.quaternion);

    // Scaling coefficient.
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

    // dispatch trace

  }


  render() {
    return null;
  }


}
