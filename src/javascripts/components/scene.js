

import _ from 'lodash';
import $ from 'jquery';
import React, { Component, findDOMNode, PropTypes } from 'react';
import THREE from 'three';
import EventEmitter from 'events';
import TWEEN from 'tween.js';
import { connect } from 'react-redux';
import platform from 'platform';

import Startup from './startup';
import Zoom from './zoom';
import Xray from './xray';
import Spin from './spin';


@connect(state => ({
  drivers: state.scene.drivers,
  errors: state.errors,
}))
export default class extends Component {


  static childContextTypes = {
    world:  PropTypes.object,
    camera: PropTypes.object,
    $el:    PropTypes.object,
    events: PropTypes.object,
  }


  /**
   * Expose shared components.
   *
   * @return {Object}
   */
  getChildContext() {
    return _.pick(this, [
      'world',
      'camera',
      '$el',
      'events',
    ]);
  }


  /**
   * Set initial state.
   *
   * @param {Object} props
   */
  constructor(props) {
    super(props);
    this.state = { mounted: false };
  }


  /**
   * Start the shared scene components.
   */
  componentDidMount() {

    this.$el = $(findDOMNode(this));
    this.events = new EventEmitter();

    this.createScene();
    this.createCamera();
    this.animate();

    this.setState({ mounted: true });

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

    if (platform.os.family != 'Android') {
      this.renderer.setPixelRatio(window.devicePixelRatio || 1);
    }

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
    window.requestAnimationFrame(this.animate.bind(this));
    this.renderer.render(this.scene, this.camera);

  }


  /**
   * Render the scene container.
   */
  render() {

    if (this.state.mounted) {

      // Is an error visible?
      let isError = _.includes(this.props.errors, true);

      return (
        <div id="scene">
          {this.props.drivers.startup ? <Startup /> : null}
          {this.props.drivers.zoom ? <Zoom /> : null}
          {this.props.drivers.xray ? <Xray /> : null}
          {isError ? <Spin /> : null}
        </div>
      );

    }

    else return (
      <div id="scene">
      </div>
    )

  }


}
