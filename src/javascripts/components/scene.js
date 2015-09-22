

import _ from 'lodash';
import $ from 'jquery';
import React, { Component, findDOMNode } from 'react';
import THREE from 'three';
import EventEmitter from 'events';
import TWEEN from 'tween.js';


export default class extends Component {


  /**
   * Start the shared scene components.
   */
  componentDidMount() {

    this.$el = $(findDOMNode(this));
    this.events = new EventEmitter();

    this.createScene();
    this.createCamera();
    this.animate();

  }


  /**
   * Create the scene and renderer.
   */
  createScene() {

    this.scene = new THREE.Scene();

    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });

    // Inject the WebGL container.
    this.$el.append(this.renderer.domElement);

    // Add a top-level mesh group.
    this.world = new THREE.Object3D();
    this.scene.add(this.world);

  }


  /**
   * Create the camera, listen for resize.
   */
  createCamera() {

    this.camera = new THREE.PerspectiveCamera(
      75, 1, 0.1, 100000
    );

    this.fitCamera()

    // Re-fit on resize.
    let resize = _.debounce(this.fitCamera.bind(this), 500);
    $(window).resize(resize);

  }


  /**
   * Fit the camera to the container.
   */
  fitCamera() {

    let w = this.$el.width();
    let h = this.$el.height();

    // Set aspect ratio.
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();

    // Size the renderer.
    this.renderer.setSize(w, h);

  }


  /**
   * Render the scene.
   */
  animate() {

    this.events.emit('render');
    TWEEN.update();

    // Render the new frame.
    window.requestAnimationFrame(this.render.bind(this));
    this.renderer.render(this.scene, this.camera);

  }


  /**
   * Render the scene container.
   */
  render() {
    return <div id="scene"></div>
  }


}
