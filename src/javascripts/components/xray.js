

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
   * Mount the VR.
   */
  componentDidMount() {
    this.initializeHeading();
    this.drawCenterDot();
    //this.listenForOrientation();
    //this.listenForZoom();
    //this.listenForRender();
  }


  /**
   * Store the base orientation matrix.
   */
  initializeHeading() {

    let [x, y, z] = this.props.location;

    // Store the default heading.
    this.context.camera.lookAt(new THREE.Vector3(0, 0, 0));
    this.eye = this.context.camera.matrix.clone();

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

    let geometry = new THREE.SphereGeometry(30, 32, 32);

    let material = new THREE.MeshLambertMaterial({
      color: 0xff0000
    });

    this.dot = new THREE.Mesh(geometry, material);
    this.dot.visible = false;

    // Sync light with camera.
    light.position.copy(this.context.camera.position);
    this.context.world.add(this.dot, light);

  }


  render() {
    return null;
  }


}
