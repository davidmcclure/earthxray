

import _ from 'lodash';
import Radio from 'backbone.radio';
import THREE from 'three';
import Hammer from 'hammerjs';

import Step from './step';
import * as mats from './materials.yml';
import * as utils from '../utils';


export default class Xray extends Step {


  /**
   * Position and sync the camera.
   */
  start() {

    this.positionCamera();
    this.listenForOrientation();
    this.listenForZoom();
    this.drawCenterDot();

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
   * TODO|dev
   */
  drawCenterDot() {

    let light = new THREE.PointLight(0xffffff, 1, 0);
    light.position.set(this.camera.position.x, this.camera.position.y,
                       this.camera.position.z);

    this.world.add(light);

    let geometry = new THREE.SphereGeometry(30, 32, 32);

    let material = new THREE.MeshLambertMaterial({
      color: 0xff0000
    });

    this.dot = new THREE.Mesh(geometry, material);
    this.world.add(this.dot);

  }


  /**
   * Render a country highlight.
   *
   * @param {Object} feature
   */
  highlightCountry(feature) {

    // Unhighlight previous country.
    if (this.country) {

      let lines = this.shared.countries[this.country.id];
      lines.material.setValues(mats.country.def);

      // Clear render order.
      for (let c of lines.children) {
        c.renderOrder = 0;
      }

      this.country = null;

    }

    // Highlight current country.
    if (feature) {

      let lines = this.shared.countries[feature.id];
      lines.material.setValues(mats.country.hl);

      // Bump render order.
      for (let c of lines.children) {
        c.renderOrder = 1;
      }

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

    let distance, country;

    // Over the horizon?
    if (u > 0) {

      heading.multiplyScalar(u);

      // Get far-side intersection.
      let point = this.camera.position.clone().add(heading);
      distance = this.camera.position.distanceTo(point);

      this.dot.position.set(point.x, point.y, point.z);
      this.dot.visible = true;

      //// Get the enclosing country.
      //let [x, y, z] = point.toArray();
      //country = this.shared.borders.query(x, y, z);

      //// Render the highlight.
      //this.highlightCountry(country);

    }

    else {
      this.dot.visible = false;
    }

    Radio.trigger('xray', 'trace', {
      country: country,
      distance: distance,
    });

  }


}
