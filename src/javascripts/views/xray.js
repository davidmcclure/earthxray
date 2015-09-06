

import _ from 'lodash';
import Radio from 'backbone.radio';
import THREE from 'three';
import Hammer from 'hammerjs';

import Step from './step';
import * as opts from '../opts.yml';
import * as utils from '../utils';


export default class Xray extends Step {


  /**
   * Position and sync the camera.
   */
  start() {

    this.positionCamera();
    this.listenForOrientation();
    this.listenForZoom();

    this.events.on('render', () => {
      this.point();
      this.trace();
    });

    Radio.trigger('xray', 'start');

  }


  /**
   * Move the camera into place.
   */
  positionCamera() {

    // Get XYZ location.
    let [x, y, z] = utils.lonLatToXYZ(
      this.shared.location.longitude,
      this.shared.location.latitude
    );

    // Store the default heading.
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    this.eye = this.camera.matrix.clone();

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

    let el = this.$el.get(0);
    let gesture = new Hammer(el);

    // Enable pinch.
    gesture.get('pinch').set({ enable: true });

    let minFov = opts.camera.minFov;
    let maxFov = opts.camera.maxFov;
    let start;

    // Capture initial FOV.
    gesture.on('pinchstart', e => {
      start = this.camera.fov;
    });

    gesture.on('pinch', e => {

      // Break if we're out of bounds.
      let fov = start / e.scale;
      if (fov < minFov || fov > maxFov) return;

      // Apply the new FOV.
      this.camera.fov = fov;
      this.camera.updateProjectionMatrix();

    });

  }


  /**
   * Render a country highlight.
   *
   * @param {Object} feature
   */
  highlightCountry(feature) {

    if (this.country && (!feature || feature.id != this.country.id)) {

      let line = this.shared.countries[this.country.id];

      line.material.setValues({
        linewidth: opts.borders.lineWidth,
        color: opts.borders.lineColor,
      });

      line.renderOrder = 0;

    }

    if (feature && (!this.country || feature.id != this.country.id)) {

      let line = this.shared.countries[feature.id];

      line.material.setValues({
        linewidth: opts.borders.hl.lineWidth,
        color: opts.borders.hl.lineColor,
      });

      line.renderOrder = 1;
      this.country = feature;

    }

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

    // Over the horizon?
    if (u < 0) return;
    heading.multiplyScalar(u);

    // Get far-side intersection.
    let point = this.camera.position.clone().add(heading);
    let distance = this.camera.position.distanceTo(point);

    // Get the enclosing country.
    let [x, y, z] = point.toArray();
    let country = this.shared.borders.query(x, y, z);
    this.highlightCountry(country);

    Radio.trigger('xray', 'trace', {
      point: point,
      distance: distance,
      country: country,
    });

  }


}
