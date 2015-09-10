

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

// Register the typeface.
import helvetiker from 'three.regular.helvetiker';
THREE.typeface_js.loadFace(helvetiker);


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

    let labels = new THREE.Geometry();

    let borders = [];
    for (let c of countryJSON.features) {

      borders.push(new Promise((resolve, reject) => {
        setTimeout(() => {

          // Draw borders.
          this.drawCountry(c);

          // Create label.
          if (c.properties.anchor) {

            // Trace the text.
            let geometry = new THREE.TextGeometry(c.name, {
              curveSegments: 1,
              size: 30,
              font: 'helvetiker',
              height: 0,
            });

            geometry.center();

            let mesh = new THREE.Mesh(geometry);

            let [x, y, z] = utils.lonLatToXYZ(
              c.properties.anchor[0],
              c.properties.anchor[1]
            );

            mesh.position.set(x, y, z);

            mesh.lookAt(new THREE.Vector3(0, 0, 0));
            mesh.updateMatrix();
            labels.merge(geometry, mesh.matrix);

          }

          resolve();

        }, 0);
      }));

    }

    return Promise.all(borders).then(() => {

      let material = new THREE.MeshBasicMaterial({
        color: 0x000000
      });

      let mesh = new THREE.Mesh(labels, material);
      this.world.add(mesh);

      console.log('test');

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
