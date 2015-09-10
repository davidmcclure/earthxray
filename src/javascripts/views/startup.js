

import _ from 'lodash';
import Promise from 'bluebird';
import THREE from 'three';
import createGeometry from 'three-bmfont-text';
import loadFont from 'load-bmfont';

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
      this.drawLonLines(),
      this.drawLatLines(),
      this.drawEquator(),
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

    // CCA3 -> border.
    this.shared.countries = {};

    let borders = [];
    for (let c of countryJSON.features) {

      borders.push(new Promise((resolve, reject) => {
        this.drawCountry(c);
        resolve();
      }));

    }

    // TODO|dev

    let texture = THREE.ImageUtils.loadTexture('fonts/DejaVu-sdf.png');

    loadFont('fonts/DejaVu-sdf.fnt', (err, font) => {
      for (let c of countryJSON.features) {

        if (c.properties.anchor) {

          let [x, y, z] = utils.lonLatToXYZ(
            c.properties.anchor[0],
            c.properties.anchor[1]
          );

          let geometry = createGeometry({
            font: font,
            text: c.properties.name,
            width: 5000,
          });

          let material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            color: 0x000000,
          });

          let mesh = new THREE.Mesh(geometry, material);
          mesh.position.set(x, y, z);
          //mesh.lookAt(new THREE.Vector3(0, 0, 0));

          this.world.add(mesh);

        }

      }
    });

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
