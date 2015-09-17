

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

    // Get the swivel destination point.

    let d = this.camera.position.z + (opts.earth.radius*1.5);
    let r = d/2;

    let [gx, gy, gz] = this.shared.location;
    let cz = this.camera.position.z - r;

    let a = gx*gx + gy*gy + gz*gz;
    let b = 2*gz*-cz;
    let c = cz*cz - r*r;

    let t = (-b + Math.sqrt(b*b - 4*a*c)) / (2*a);

    let x = t*gx;
    let y = t*gy;
    let z = t*gz;

    // Get start and end coordinates.

    let [lon1, lat1] = utils.xyzToLonLat(
      this.camera.position.x,
      this.camera.position.y,
      this.camera.position.z-cz,
      r
    );

    let [lon2, lat2] = utils.xyzToLonLat(x, y, z-cz, r);

    // Generate a spline for the swivel.

    let points = [];
    _.times(21, i => {

      let [lon, lat] = utils.intermediatePoint(
        lon1, lat1, lon2, lat2, i/20
      );

      let [x, y, z] = utils.lonLatToXYZ(lon, lat, r);
      points.push(new THREE.Vector3(x, y, z+cz));

    });

    let spline = new THREE.SplineCurve3(points);

    // Swivel:

    let t1 = new TWEEN.Tween()
      .to(null, 3000)
      .easing(TWEEN.Easing.Quadratic.Out)
      .onUpdate(f => {
        this.camera.position.copy(spline.getPoint(f))
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
      });

    // Zoom down:

    let t2 = new TWEEN.Tween(this.camera.position)
      .to({ x:gx, y:gy, z:gz }, 2000)
      .easing(TWEEN.Easing.Quadratic.Out);

    return new Promise(resolve => {
      t2.onComplete(resolve);
      t1.chain(t2).start();
    });

  }


}
