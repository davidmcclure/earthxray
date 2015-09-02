

import Promise from 'bluebird';
import THREE from 'three';

import countries from '../data/countries';
import * as opts from '../opts.yml';


export default class Startup {


  /**
   * Set the scene object.
   *
   * @param {Scene} scene
   */
  constructor(scene) {
    this.scene = scene;
    this.start();
  }


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
      this.scene.options.location = pos;
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
    this.scene.camera.position.z = opts.camera.startz;
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
    this.scene.world.add(this.sphere);

  }


  /**
   * Render countries and labels.
   */
  drawGeography() {

    let deferred = Promise.pending();
    let texts = new THREE.Geometry();

    let i = 0;
    for (let c of countries) {
      setTimeout(() => {

        // Draw the borders.
        for (let p of c.points) {
          this.drawBorder(p);
        }

        // Create the label.
        if (c.anchor) {

          let geometry = new THREE.TextGeometry(c.name, {
            curveSegments: 1,
            size: 30,
            font: 'helvetiker',
            height: 0,
          });

          geometry.center();

          let mesh = new THREE.Mesh(geometry);

          // Move to the label anchor.
          mesh.position.set(
            c.anchor[0],
            c.anchor[1],
            c.anchor[2]
          );

          // Face "inward."
          mesh.lookAt(new THREE.Vector3(0, 0, 0));
          mesh.updateMatrix();

          // Merge the geometry.
          texts.merge(geometry, mesh.matrix);

        }

        // Render the labels.
        if (++i == countries.length) {

          let material = new THREE.MeshBasicMaterial({
            color: 0x000000
          });

          let mesh = new THREE.Mesh(texts, material);
          this.world.add(mesh);

          deferred.resolve();

        }

      }, 0);
    }

    return deferred.promise;

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
    this.scene.world.add(line);

  }


}
