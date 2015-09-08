

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

    let thin = new THREE.LineBasicMaterial(mats.lonlat.thin);

    // Longitude:
    _.times(18, i => {
      this.drawLonRing(i*10, thin);
    });

    // Latitude:
    for (let i of _.range(1, 9)) {
      this.drawLatRing( i*10, thin);
      this.drawLatRing(-i*10, thin);
    }

    let thick = new THREE.LineBasicMaterial(mats.lonlat.thick);

    // Equator:
    this.drawLatRing(0, thick);

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

    // Get an array of border geometries.
    let segments = stateJSON.features.reduce((all, s) => {
      return all.concat(utils.featureToGeoms(s));
    }, []);

    // Merge the segments.
    let geometry = utils.mergeLines(segments);

    let material = new THREE.LineBasicMaterial(mats.state)

    let states = new THREE.Line(
      geometry,
      material,
      THREE.LinePieces
    );

    this.world.add(states);

  }


  /**
   * Draw a latitude ring.
   *
   * @param {Number} degrees
   * @param {THREE.Material} material
   */
  drawLatRing(degrees, material) {

    let rDeg = THREE.Math.degToRad(degrees);

    let offset = Math.sin(rDeg) * opts.earth.radius;
    let radius = Math.cos(rDeg) * opts.earth.radius;

    let geometry = utils.drawCircle(
      100,
      'y',
      radius
    );

    // Move up/down.
    let shift = new THREE.Matrix4();
    shift.setPosition(new THREE.Vector3(0, offset, 0));
    geometry.applyMatrix(shift);

    let ring = new THREE.Line(geometry, material);
    this.world.add(ring);

  }


  /**
   * Draw a longitude ring.
   *
   * @param {Number} degrees
   * @param {THREE.Material} material
   */
  drawLonRing(degrees, material) {

    let rDeg = THREE.Math.degToRad(degrees);

    let geometry = utils.drawCircle(
      100,
      'z',
      opts.earth.radius
    );

    // Spin the ring.
    let shift = new THREE.Matrix4();
    shift.makeRotationY(rDeg);
    geometry.applyMatrix(shift);

    let ring = new THREE.Line(geometry, material);
    this.world.add(ring);

  }


}
