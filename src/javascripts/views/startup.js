

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

    this.shared.materials = {};

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
   * @return {Array} - The generated meshes.
   */
  drawFeature(feature) {

    let coords = feature.geometry.coordinates;

    let geos = []
    switch (feature.geometry.type) {

      case 'Polygon':
        geos.push(this.drawPolygon(coords[0]));
      break;

      case 'MultiPolygon':
        for (let [polygon] of coords) {
          geos.push(this.drawPolygon(polygon));
        }
      break;

    }

    let material = new THREE.LineBasicMaterial({
      color: opts.borders.lineColor,
      linewidth: opts.borders.lineWidth,
    });

    for (let g of geos) {
      let line = new THREE.Line(g, material);
      this.world.add(line);
    }

    // Map country code -> material.
    this.shared.materials[feature.id] = material;

  }


  /**
   * Draw a polygon.
   *
   * @param {Array} points
   * @return {THREE.Line}
   */
  drawPolygon(points) {

    let geometry = new THREE.Geometry();

    // Register the vertices.
    for (let [lon, lat] of points) {
      let [x, y, z] = utils.lonLatToXYZ(lon, lat);
      geometry.vertices.push(new THREE.Vector3(x, y, z));
    }

    return geometry;

  }


}
