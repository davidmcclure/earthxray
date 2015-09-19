

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

        this.camera.position.set(x, y, z);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));

      });

    let zoom = new TWEEN.Tween(this.camera.position)
      .to({ x:x1, y:y1, z:z1 })
      .easing(TWEEN.Easing.Quadratic.Out);

    return new Promise(resolve => {
      zoom.onComplete(resolve);
      swivel.chain(zoom).start();
    });

  }


}
