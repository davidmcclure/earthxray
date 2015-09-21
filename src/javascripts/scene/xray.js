

import _ from 'lodash';
import $ from 'jquery';
import Radio from 'backbone.radio';
import THREE from 'three';
import Promise from 'bluebird';
import Hammer from 'hammerjs';

import { store } from '../';
import { OrientationError } from '../errors';
import { traceCenter } from '../actions/xray';
import Step from './step';
import mats from './materials.yml';


export default class extends Step {


  /**
   * Position and sync the camera.
   */
  start() {
    return Promise.all([
      this.positionCamera(),
      this.drawCenterDot(),
      this.listenForOrientation(),
      this.listenForZoom(),
      this.listenForRender(),
    ]);
  }


  /**
   * Move the camera into place.
   */
  positionCamera() {

    let [x, y, z] = this.shared.location;

    // Store the default heading.
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    this.eye = this.camera.matrix.clone();

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
    light.position.copy(this.camera.position);

    let geometry = new THREE.SphereGeometry(30, 32, 32);

    let material = new THREE.MeshLambertMaterial({
      color: 0xff0000
    });

    this.dot = new THREE.Mesh(geometry, material);
    this.dot.visible = false;

    this.world.add(this.dot, light);

  }


  /**
   * Bind to device orientation.
   */
  listenForOrientation() {

    return new Promise((resolve, reject) => {

      if (window.DeviceOrientationEvent) {

        // Check for the accelerometer.
        $(window).bind('deviceorientation.check', e => {

          // Flash error if no data.
          if (!e.originalEvent.alpha) {
            reject(new OrientationError());
          } else {
            resolve();
          }

          $(window).unbind('deviceorientation.check');

        });

        // Save the orientation data.
        $(window).bind('deviceorientation', e => {
          this.orientation = e.originalEvent;
        });

      }

      else {
        reject(new OrientationError());
      }

    });

  }


  /**
   * Pinch to zoom.
   */
  listenForZoom() {

    let el = this.$el.get(0);
    let gesture = new Hammer(el);

    // Enable pinch.
    gesture.get('pinch').set({ enable: true });

    let start;

    // Capture initial FOV.
    gesture.on('pinchstart', e => {
      start = this.camera.fov;
    });

    gesture.on('pinch', e => {

      // Break if we're out of bounds.
      let fov = start / e.scale;
      if (fov < 5 || fov > 120) return;

      // Apply the new FOV.
      this.camera.fov = fov;
      this.camera.updateProjectionMatrix();

    });

  }


  /**
   * Orient the camera on render.
   */
  listenForRender() {

    this.events.on('render', () => {
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

    this.camera.quaternion.setFromRotationMatrix(r);

  }


  /**
   * Trace the far-side intersection point.
   */
  trace() {

    // Heading vector.
    let heading = new THREE.Vector3(0, 0, -1);
    heading.applyQuaternion(this.camera.quaternion);

    // Scaling coefficient.
    let a = heading.dot(heading);
    let b = 2 * heading.dot(this.camera.position);
    let u = (-2*b) / (2*a);

    let distance;

    // Looking down.
    if (u > 0) {

      heading.multiplyScalar(u);

      // Get far-side intersection.
      let c = this.camera.position.clone().add(heading);
      distance = this.camera.position.distanceTo(c);

      // Update center dot.
      this.dot.position.copy(c);
      this.dot.visible = true;

    }

    // Looking into space.
    else {
      this.dot.visible = false;
    }

    store.dispatch(traceCenter(distance));

  }


}
