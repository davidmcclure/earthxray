

import React, { Component } from 'react';
import Promise from 'bluebird';


export default class extends Component {


  /**
   * Render geography, geolocate.
   */
  componentDidMount() {

    Promise.all([
      this.getLocation(),
      this.positionCamera(),
      this.drawLonLats(),
      this.drawEquator(),
      this.drawCountries(),
      this.drawStates(),
      this.drawLabels(),
    ]);

  }


  /**
   * Geolocate the client.
   */
  getLocation() {

    return new Promise((resolve, reject) => {
      window.navigator.geolocation.getCurrentPosition(pos => {

        // Get 3d location.
        let location = utils.lonLatToXYZ(
          pos.coords.longitude,
          pos.coords.latitude
        );

        // TODO: Set in store.

        resolve();

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
  drawLonLats() {

    let geometries = [];

    // Longitude:
    for (let i of _.range(18)) {
      geometries.push(utils.drawLonRing(i*10));
    }

    // Latitude:
    for (let i of _.range(1, 9)) {
      geometries.push(utils.drawLatRing( i*10));
      geometries.push(utils.drawLatRing(-i*10));
    }

    let material = new THREE.LineBasicMaterial(mats.lonlat.thin);

    this._drawLines(geometries, material);

  }


  /**
   * Draw the equator.
   */
  drawEquator() {

    let geometry = utils.drawLatRing(0);

    let material = new THREE.LineBasicMaterial(mats.lonlat.thick);

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

    this._drawLines(segments, material);

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

    this._drawLines(segments, material);

  }


  /**
   * Draw country labels.
   */
  drawLabels() {

    let texture = new Promise(resolve => {
      THREE.ImageUtils.loadTexture('bm-fonts/lato.png', null, resolve);
    });

    let font = new Promise(resolve => {
      loadFont('bm-fonts/Lato-Regular-64.fnt', (err, font) => {
        resolve(font);
      });
    });

    // Wait for the texture and font.
    return Promise.all([texture, font]).spread((texture, font) => {
      for (let c of countryJSON.features) {

        if (!c.properties.anchor) continue;

        // Get 3D anchor.
        let [x, y, z] = utils.lonLatToXYZ(
          c.properties.anchor[0],
          c.properties.anchor[1]
        );

        let geometry = createText({
          font: font,
          text: c.properties.label,
        });

        let material = new THREE.MeshBasicMaterial({
          map: texture,
          side: THREE.DoubleSide,
          color: 0x000000,
          transparent: true,
        });

        let mesh = new THREE.Mesh(geometry, material);
        mesh.up.set(0, -1, 0);

        // Scale by area.
        let scale = Math.sqrt(c.properties.area)*0.0015;
        mesh.scale.multiplyScalar(scale);

        // Face the origin.
        mesh.position.set(x, y, z);
        mesh.lookAt(mesh.position.clone().multiplyScalar(2));
        mesh.translateX(-(geometry.layout.width/2)*scale);

        this.world.add(mesh);

      }
    });

  }


  /**
   * Merge and render a set of line geoemtries.
   *
   * @param {THREE.Geometry[]} geometries
   * @param {THREE.Material} material
   */
  _drawLines(geometries, material) {

    let merged = utils.mergeLines(geometries);

    let line = new THREE.Line(merged, material, THREE.LinePieces);
    this.world.add(line);

  }


  render() {
    return null;
  }


}
