

import { connect } from 'react-redux';
import React, { Component, PropTypes } from 'react';
import THREE from 'three';
import TWEEN from 'tween.js';

import * as utils from '../utils';
import * as actions from '../actions/scene';
import opts from '../opts.yml';
import mats from './materials.yml';


@connect(
  state => ({ location: state.scene.location }),
  actions
)
export default class extends Component {


  static contextTypes = {
    world:  PropTypes.object.isRequired,
    camera: PropTypes.object.isRequired,
  }


  /**
   * Run the zoom animation.
   */
  componentDidMount() {

    this.addDot();

    this.zoom().then(() => {
      this.removeDot();
      this.props.finishZoom();
    });

  }


  /**
   * Add the location dot.
   */
  addDot() {

    let geometry = new THREE.SphereGeometry(50, 32, 32);

    let material = new THREE.MeshLambertMaterial(mats.dot);

    this.dot = new THREE.Mesh(geometry, material);

    // Place dot on GPS location.
    let [x, y, z] = this.props.location;
    this.dot.position.set(x, y, z);

    // Sync light with camera.
    this.light = new THREE.PointLight(0xffffff, 1, 0);
    this.light.position.copy(this.context.camera.position);

    this.context.world.add(this.dot, this.light);

  }


  /**
   * Remove the location dot.
   */
  removeDot() {
    this.context.world.remove(this.dot, this.light);
  }


  /**
   * Zoom into place.
   */
  zoom() {

    let camera = this.context.camera;

    // Camera coordinates.
    let [x0, y0, z0] = camera.position.toArray();
    let [lon0, lat0] = utils.xyzToLonLat(x0, y0, z0);

    // GPS coordinates.
    let [x1, y1, z1] = this.props.location;
    let [lon1, lat1] = utils.xyzToLonLat(x1, y1, z1);

    let r0 = camera.position.z;
    let r1 = opts.earth.radius * 1.5;
    let dr = r1-r0;

    let swivel = new TWEEN.Tween()
      .to(null, 3000)
      .easing(TWEEN.Easing.Quadratic.Out)
      .onUpdate(f => {

        let r = r0 + dr*f;

        let [lon, lat] = utils.intermediatePoint(
          lon0, lat0, lon1, lat1, f
        );

        let [x, y, z] = utils.lonLatToXYZ(lon, lat, r);

        // Update the camera position.
        camera.position.set(x, y, z);
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        // Sync light with camera.
        this.light.position.copy(camera.position);

      });

    let zoom = new TWEEN.Tween(camera.position)
      .to({ x:x1, y:y1, z:z1 })
      .easing(TWEEN.Easing.Quadratic.Out);

    // Run the tweens.
    return new Promise(resolve => {
      zoom.onComplete(resolve);
      swivel.chain(zoom).start();
    });

  }


  render() {
    return null;
  }


}
