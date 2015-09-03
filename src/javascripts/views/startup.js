

import Promise from 'bluebird';
import THREE from 'three';

import Step from './step';
import countries from '../data/countries';
import * as opts from '../opts.yml';


export default class Startup extends Step {


  /**
   * Render geography, geolocate.
   *
   * @return {Promise}
   */
  start() {
    return Promise.all([
      this.getLocation(),
      this.positionCamera(),
      this.drawSphere(),
      this.drawGeography()
    ]);
  }


  /**
   * Geolocate the client.
   */
  getLocation() {

    let deferred = Promise.pending();

    window.navigator.geolocation.getCurrentPosition(pos => {

      // Save the position.
      this.options.location = pos.coords;
      deferred.resolve();

    }, err => {
      // TODO: Error.
    });

    return deferred.promise;

  }


  /**
   * Move the camera back to show the entire earth.
   */
  positionCamera() {
    this.camera.position.z = opts.camera.startz;
  }


  /**
   * Render a sphere for the earth.
   */
  drawSphere() {

    let geometry = new THREE.SphereGeometry(
      opts.earth.radius,
      opts.sphere.segments,
      opts.sphere.segments
    );

    let material = new THREE.MeshBasicMaterial({
      color: opts.sphere.lineColor,
      wireframeLinewidth: opts.sphere.lineWidth,
      wireframe: true,
    });

    this.sphere = new THREE.Mesh(geometry, material);
    this.world.add(this.sphere);

  }


  /**
   * Render countries and labels.
   */
  drawGeography() {

    let steps = [];

    for (let c of countries) {

      let deferred = Promise.pending();
      steps.push(deferred.promise);

      setTimeout(() => {

        // Draw the borders.
        for (let p of c.points) {
          this.drawBorder(p);
        }

        deferred.resolve();
        // TODO: Labels.

      }, 0);

    }

    return Promise.all(steps);

  }


  /**
   * Draw a border line.
   *
   * @param {Array} points
   */
  drawBorder(points) {

    let material = new THREE.LineBasicMaterial({
      color: opts.borders.lineColor,
      linewidth: opts.borders.lineWidth,
    });

    let geometry = new THREE.Geometry();

    // Register the vertices.
    for (let [x, y, z] of points) {
      geometry.vertices.push(new THREE.Vector3(x, y, z));
    }

    // Register the line.
    let line = new THREE.Line(geometry, material);
    this.world.add(line);

  }


}
