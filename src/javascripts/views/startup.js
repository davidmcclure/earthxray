

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
    let lonGeos = _.range(18).map(i => {
      return utils.drawLonRing(i*10);
    });

    let mergedLonGeos = utils.mergeLines(lonGeos);

    let lons = new THREE.Line(mergedLonGeos, thin, THREE.LinePieces);
    this.world.add(lons);

    // Latitude:
    let latGeos = [];
    for (let i of _.range(1, 9)) {
      latGeos.push(utils.drawLatRing( i*10, thin));
      latGeos.push(utils.drawLatRing(-i*10, thin));
    }

    let mergedLatGeos = utils.mergeLines(latGeos);

    let lats = new THREE.Line(mergedLatGeos, thin, THREE.LinePieces);
    this.world.add(lats);

    let thick = new THREE.LineBasicMaterial(mats.lonlat.thick);

    // Equator:
    let equatorGeo = utils.drawLatRing(0);
    let equator = new THREE.Line(equatorGeo, thick);
    this.world.add(equator);

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


}
