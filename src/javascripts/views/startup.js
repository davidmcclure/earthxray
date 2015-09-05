

import Promise from 'bluebird';
import THREE from 'three';

import Step from './step';
import countries from '../data/countries';
import * as opts from '../opts.yml';
import * as utils from '../utils.js';


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

    return new Promise((resolve, reject) => {
      window.navigator.geolocation.getCurrentPosition(pos => {

        // Save the position.
        this.shared.location = pos.coords;
        resolve();

      }, err => {

        // TODO: Flash error.
        reject();

      });
    });

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

    for (let c of countries.features) {

      steps.push(new Promise((resolve, reject) => {
        setTimeout(() => {

          // Draw borders.
          this.drawFeature(c);

          // TODO: Labels.
          resolve();

        }, 0);
      }));

    }

    return Promise.all(steps);

  }


  /**
   * Draw a GeoJSON feature.
   *
   * @param {Object} feature
   */
  drawFeature(feature) {

    let coords = feature.geometry.coordinates;

    switch (feature.geometry.type) {

      case 'Polygon':
        this.drawPolygon(coords[0]);
      break;

      case 'MultiPolygon':
        for (let [polygon] of coords) {
          this.drawPolygon(polygon);
        }
      break;

    }

  }


  /**
   * Draw a polygon.
   *
   * @param {Array} points
   */
  drawPolygon(points) {

    let material = new THREE.LineBasicMaterial({
      color: opts.borders.lineColor,
      linewidth: opts.borders.lineWidth,
    });

    let geometry = new THREE.Geometry();

    // Register the vertices.
    for (let [lon, lat] of points) {
      let [x, y, z] = utils.lonLatToXYZ(lon, lat);
      geometry.vertices.push(new THREE.Vector3(x, y, z));
    }

    // Create the line.
    let line = new THREE.Line(geometry, material);
    this.world.add(line);

  }


  /**
   * Draw a border line.
   *
   * @param {Array} points
   */
  //drawBorder(points) {

    //let material = new THREE.LineBasicMaterial({
      //color: opts.borders.lineColor,
      //linewidth: opts.borders.lineWidth,
    //});

    //let geometry = new THREE.Geometry();

    //// Register the vertices.
    //for (let [x, y, z] of points) {
      //geometry.vertices.push(new THREE.Vector3(x, y, z));
    //}

    //// Register the line.
    //let line = new THREE.Line(geometry, material);
    //this.world.add(line);

  //}


}
