

import THREE from 'three';
import Hammer from 'hammerjs';

import * as opts from '../opts.yml';
import * as utils from '../utils';


export default class Xray {


  /**
   * Set the scene object.
   *
   * @param {Scene} scene
   */
  constructor(scene) {
    this.scene = scene;
  }


  /**
   * Position and sync the camera.
   */
  start() {
    this.zoomCamera();
    this.listenForOrientation();
    this.listenForZoom();
  }


  /**
   * Move the camera into place.
   */
  zoomCamera() {

    // Get 3D location.
    let [x, y, z] = utils.lonLatToXYZ(
      this.scene.options.location.coords.longitude,
      this.scene.options.location.coords.latitude
    );

    // Position the camera.
    this.scene.camera.position.set(x, y, z);

    // Store the default heading.
    this.eye = this.scene.camera.matrix.clone();

    // TODO: More direct way to do this?
    this.eye.lookAt(
      new THREE.Vector3(x, y, z),
      new THREE.Vector3(0, 0.001, 0),
      new THREE.Vector3(x, y, z).normalize()
    );

  }


  /**
   * Bind to device orientation.
   */
  listenForOrientation() {

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', data => {
        this.orientation = data;
      });
    }

    else {
      // TODO: Error.
    }

  }


  /**
   * Pinch to zoom.
   */
  listenForZoom() {

    let el = this.scene.$el.get(0);
    let gesture = new Hammer(el);

    // Enable pinch.
    gesture.get('pinch').set({ enable: true });

    let minFov = opts.camera.minFov;
    let maxFov = opts.camera.maxFov;
    let _fov;

    // Capture initial FOV.
    gesture.on('pinchstart', e => {
      _fov = this.scene.camera.fov;
    });

    gesture.on('pinch', e => {

      let fov = _fov / e.scale;

      // Break if we're out of bounds.
      if (fov < minFov || fov > maxFov) return;

      // Apply the new FOV.
      this.scene.camera.fov = fov;
      this.scene.camera.updateProjectionMatrix();

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

    this.camera.quaternion.setFromRotationMatrix(r);

  }


  /**
   * Trace the heading vector.
   */
  trace() {

    // Get the heading vector.
    let heading = new THREE.Vector3(0, 0, -1);
    heading.applyQuaternion(this.camera.quaternion);

    // Get the scaling coefficient.
    let a = heading.dot(heading);
    let b = 2 * heading.dot(this.camera.position);
    let u = (-2*b) / (2*a);

    let distance = Infinity;

    // If we're not looking out into space.
    if (u > 0) {

      // Get far-side intersection.
      let delta = heading.clone().multiplyScalar(u);
      let point = this.camera.position.clone().add(delta);

      // Get distance to the point.
      distance = this.camera.position.distanceTo(point);

    }

    // TODO: Publish heading.

  }


}
