

import Promise from 'bluebird';
import THREE from 'three';

import Step from './step';
import Borders from '../lib/borders';
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
      this.indexCountries(),
      this.drawCountries(),
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
   * Index country borders.
   */
  indexCountries() {
    let index = new Borders();
    index.indexFeatures(countries.features);
    this.shared.borders = index;
  }


  /**
   * Render countries and labels.
   */
  drawCountries() {

    let steps = [];
    for (let c of countries.features) {

      steps.push(new Promise((resolve, reject) => {
        setTimeout(() => {

          // Draw borders.
          this.drawCountry(c);
          resolve();

        }, 0);
      }));

    }

    return Promise.all(steps);

  }


  /**
   * Draw country borders.
   *
   * @param {Object} country
   */
  drawCountry(country) {

    let material = new THREE.LineBasicMaterial({
      color: opts.borders.lineColor,
      linewidth: opts.borders.lineWidth,
    });

    let geos = utils.featureToGeoms(country);

    for (let g of geos) {
      let line = new THREE.Line(g, material);
      this.world.add(line);
    }

  }


}
