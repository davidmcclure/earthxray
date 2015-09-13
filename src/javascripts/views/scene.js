

import _ from 'lodash';
import $ from 'jquery';
import Promise from 'bluebird';
import EventEmitter from 'events';
import THREE from 'three';
import TWEEN from 'tween.js';


export default class {


  /**
   * Create the scene, camera, and renderer.
   */
  constructor() {

    this.shared = {};
    this.events = new EventEmitter();
    this.$el = $('#globe');

    this.createScene();
    this.createCamera();
    this.render();

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
      120, 1, 0.1, 100000
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
  render() {

    this.events.emit('render');
    TWEEN.update();

    // Render the new frame.
    window.requestAnimationFrame(this.render.bind(this));
    this.renderer.render(this.scene, this.camera);

  }


  /**
   * Provide shared objects to steps.
   *
   * @return {Object}
   */
  getMixins() {
    return _.pick(this, [
      'events',
      '$el',
      'shared',
      'world',
      'renderer',
      'camera',
    ]);
  }


}
