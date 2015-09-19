

import _ from 'lodash';
import TWEEN from 'tween.js';
import THREE from 'three';
import Promise from 'bluebird';

import Step from './step';
import * as utils from '../utils';
import opts from '../opts.yml';


export default class extends Step {


  /**
   * Zoom the camera into place.
   *
   * @return {Promise}
   */
  start() {

    this.addDot();

    // Camera coordinates.
    let [x0, y0, z0] = this.camera.position.toArray();
    let [lon0, lat0] = utils.xyzToLonLat(x0, y0, z0);

    // Location coordinates.
    let [x1, y1, z1] = this.shared.location;
    let [lon1, lat1] = utils.xyzToLonLat(x1, y1, z1);

    let r0 = this.camera.position.z;
    let r1 = opts.earth.radius * 1.5;
    let dr = r1-r0;

    let swivel = new TWEEN.Tween()
      .to(null, 3000)
      .easing(TWEEN.Easing.Quadratic.Out)
      .onUpdate(f => {

        // Shrink the sphere.
        let r = r0 + dr*f;

        let [lon, lat] = utils.intermediatePoint(
          lon0, lat0, lon1, lat1, f
        );

        // Get new 3d point.
        let [x, y, z] = utils.lonLatToXYZ(lon, lat, r);

        // Position the camera and light.
        this.camera.position.set(x, y, z);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        this.light.position.copy(this.camera.position);

      });

    let zoom = new TWEEN.Tween(this.camera.position)
      .to({ x:x1, y:y1, z:z1 })
      .easing(TWEEN.Easing.Quadratic.Out);

    // Chain the tweens.
    return new Promise(resolve => {

      zoom.onComplete(() => {
        this.removeDot();
        resolve();
      });

      swivel.chain(zoom).start();

    });

  }


  /**
   * Render a dot on the GPS location.
   */
  addDot() {

    let geometry = new THREE.SphereGeometry(50, 32, 32);

    let material = new THREE.MeshLambertMaterial({
      color: 0xff0000
    });

    this.dot = new THREE.Mesh(geometry, material);

    // Place dot on GPS location.
    let [x, y, z] = this.shared.location;
    this.dot.position.set(x, y, z);

    // Sync light with camera.
    this.light = new THREE.PointLight(0xffffff, 1, 0);
    this.light.position.copy(this.camera.position);

    this.world.add(this.dot, this.light);

  }


  /**
   * Remove the dot.
   */
  removeDot() {
    this.world.remove(this.dot, this.light);
  }


}
