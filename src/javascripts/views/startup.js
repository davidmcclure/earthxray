

import _ from 'lodash';
import Promise from 'bluebird';
import THREE from 'three';

import Step from './step';
import Borders from '../lib/borders';
import countryJSON from '../data/countries';
import stateJSON from '../data/states';
import * as utils from '../utils.js';
import * as mats from './materials.yml';
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
      this.drawGlobe(),
      this.indexCountries(),
      this.drawCountries(),
      this.drawStates(),
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
    this.camera.position.z = 20000;
  }


  /**
   * Draw lon / lat lines.
   */
  drawGlobe() {

    // Longitude:
    _.times(11, i => {
      this.drawLonRing(i*10);
    });

    _.times(3, i => {
      this.drawLatRing(i*30);
      this.drawLatRing(-i*30);
    });

  }


  /**
   * Index country borders.
   */
  indexCountries() {
    let index = new Borders();
    index.indexFeatures(countryJSON.features);
    this.shared.borders = index;
  }


  /**
   * Render countries (non-blocking).
   */
  drawCountries() {

    this.shared.countries = {};

    let steps = [];
    for (let c of countryJSON.features) {

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

    let geometries = utils.featureToGeoms(country);

    let material = new THREE.LineBasicMaterial(mats.country.def);

    let lines = new THREE.Object3D();

    // Alias the material.
    lines.material = material;

    // Create the borders.
    for (let g of geometries) {
      let line = new THREE.Line(g, material);
      lines.add(line);
    }

    // Index country -> object.
    this.shared.countries[country.id] = lines;
    this.world.add(lines);

  }


  /**
   * Render state borders.
   */
  drawStates() {

    for (let s of stateJSON.features) {
      this.drawState(s);
    }

  }


  /**
   * Draw state borders.
   *
   * @param {Object} state
   */
  drawState(state) {

    let geometries = utils.featureToGeoms(state);

    let material = new THREE.LineBasicMaterial(mats.state)

    let lines = new THREE.Object3D();

    // Create the borders.
    for (let g of geometries) {
      let line = new THREE.Line(g, material);
      lines.add(line);
    }

    this.world.add(lines);

  }


  // TODO|dev


  /**
   * Draw a latitude ring.
   *
   * @param {Number} degrees
   */
  drawLatRing(degrees=0) {

    let rDeg = THREE.Math.degToRad(degrees);

    let offset = Math.sin(rDeg) * opts.earth.radius;
    let radius = Math.cos(rDeg) * opts.earth.radius;

    let geometry = utils.drawCircle(
      100,
      'y',
      radius
    );

    let material = new THREE.LineBasicMaterial(mats.lonlat);

    let ring = new THREE.Line(geometry, material);

    // Move up/down.
    ring.position.y = offset;
    this.world.add(ring);

  }


  /**
   * Draw a longitude ring.
   *
   * @param {Number} degrees
   */
  drawLonRing(degrees=0) {

    let geometry = utils.drawCircle(
      100,
      'z',
      opts.earth.radius
    );

    let material = new THREE.LineBasicMaterial(mats.lonlat);

    let ring = new THREE.Line(geometry, material);

    // Spin the ring.
    ring.rotation.y = degrees;
    this.world.add(ring);

  }


}
