

import events from 'events';
import _ from 'lodash';
import THREE from 'three';
import $ from 'jquery';

import * as opts from '../opts.yml';


export default class Scene extends events.EventEmitter {


  /**
   * Create the scene, camera, and renderer.
   */
  constructor() {

    super();

    this.$el = $('#globe');
    this.options = {};

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
      opts.camera.fov,
      1,
      opts.camera.near,
      opts.camera.far
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

    this.w = this.$el.width();
    this.h = this.$el.height();

    // Set aspect ratio.
    this.camera.aspect = this.w / this.h;
    this.camera.updateProjectionMatrix();

    // Size the renderer.
    this.renderer.setSize(this.w, this.h);

  }


  /**
   * Render the scene.
   */
  render() {

    this.emit('render');

    // Render the new frame.
    window.requestAnimationFrame(this.render.bind(this));
    this.renderer.render(this.scene, this.camera);

  }


}
