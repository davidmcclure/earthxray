

import { connect } from 'react-redux';
import React, { Component, PropTypes } from 'react';
import THREE from 'three';


@connect(state => ({
  location: state.scene.location
}))
export default class extends Component {


  static contextTypes = {
    world: PropTypes.object.isRequired,
    camera: PropTypes.object.isRequired,
  }


  /**
   * Run the zoom animation.
   */
  componentDidMount() {

    this.addDot();

    //this.zoom().then(() => {
      //this.removeDot();
    //});

  }


  /**
   * Add the location dot.
   */
  addDot() {

    let geometry = new THREE.SphereGeometry(50, 32, 32);

    let material = new THREE.MeshLambertMaterial({
      color: 0xff0000
    });

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
    // TODO
  }


  /**
   * Zoom into place.
   */
  zoom() {
    // TODO
  }


  render() {
    return null;
  }


}
