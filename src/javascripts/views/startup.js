

import _ from 'lodash';
import Promise from 'bluebird';
import THREE from 'three';

import Step from './step';
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
      this.drawLonLines(),
      this.drawLatLines(),
      this.drawEquator(),
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
   * Draw longitude lines.
   */
  drawLonLines() {

    let material = new THREE.LineBasicMaterial(mats.lonlat.thin);

    let geometries = _.range(18).map(i => {
      return utils.drawLonRing(i*10);
    });

    this.drawLines(geometries, material);

  }


  /**
   * Draw latitude lines.
   */
  drawLatLines() {

    let material = new THREE.LineBasicMaterial(mats.lonlat.thin);

    let geometries = [];
    for (let i of _.range(1, 9)) {
      geometries.push(utils.drawLatRing( i*10));
      geometries.push(utils.drawLatRing(-i*10));
    }

    this.drawLines(geometries, material);

  }


  /**
   * Draw the equator.
   */
  drawEquator() {

    let material = new THREE.LineBasicMaterial(mats.lonlat.thick);

    let geometry = utils.drawLatRing(0);

    let equator = new THREE.Line(geometry, material);
    this.world.add(equator);

  }


  // TODO: Dry this up?


  /**
   * Render countries (non-blocking).
   */
  drawCountries() {

    // Get an array of border geometries.
    let segments = countryJSON.features.reduce((all, c) => {
      return all.concat(utils.featureToGeoms(c));
    }, []);

    let material = new THREE.LineBasicMaterial(mats.country);

    this.drawLines(segments, material);

  }


  /**
   * Render state borders.
   */
  drawStates() {

    // Get an array of border geometries.
    let segments = stateJSON.features.reduce((all, s) => {
      return all.concat(utils.featureToGeoms(s));
    }, []);

    let material = new THREE.LineBasicMaterial(mats.state);

    this.drawLines(segments, material);

  }


  /**
   * Merge and render a set of line geoemtries.
   *
   * @param {THREE.Geometry[]} geometries
   * @param {THREE.Material} material
   */
  drawLines(geometries, material) {

    let merged = utils.mergeLines(geometries);

    let line = new THREE.Line(merged, material, THREE.LinePieces);
    this.world.add(line);

  }


}
