

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
    return Promise.all([
      this.zoomCamera(),
    ]);
  }


  /**
   * Tween the camera to the client location.
   *
   * @return {Promise}
   */
  zoomCamera() {

    // get pivot sphere end point
    // http://www.ccs.neu.edu/home/fell/CSU540/programs/RayTracingFormulas.htm

    let d = this.camera.position.z + (opts.earth.radius*1.5);
    let r = d/2;

    let cz = this.camera.position.z - r;
    let [dx, dy, dz] = this.shared.location;

    let a = dx*dx + dy*dy + dz*dz;;
    let b = 2*dz*-cz;
    let c = cz*cz - r*r;

    let t = (-b + Math.sqrt(b*b - 4*a*c)) / (2*a);

    let x = t*dx;
    let y = t*dy;
    let z = t*dz;

    // get start / end coordinates

    let [lon1, lat1] = utils.xyzToLonLat(
      this.camera.position.x,
      this.camera.position.y,
      this.camera.position.z-cz,
      r
    );

    let [lon2, lat2] = utils.xyzToLonLat(x, y, z-cz, r);

    // interpolate points

    let points = [];
    for (let i of _.range(21)) {

      let [lon, lat] = utils.intermediatePoint(
        lon1, lat1, lon2, lat2, i/20
      );

      let [x, y, z] = utils.lonLatToXYZ(lon, lat, r);
      points.push(new THREE.Vector3(x, y, z+cz));

    }

    let spline = new THREE.SplineCurve3(points);

    // animate the camera

    let t1 = new TWEEN.Tween()

      // Zoom to pivot sphere end point.
      .to(null, 3000)
      .easing(TWEEN.Easing.Quadratic.Out)

      // Keep the camera pointed at the center.
      .onUpdate(f => {
        this.camera.position.copy(spline.getPoint(f))
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
      });

    let t2 = new TWEEN.Tween(this.camera.position)

      // Zoom to GPS location.
      .to({ x:dx, y:dy, z:dz }, 2000)
      .easing(TWEEN.Easing.Quadratic.Out);

    return new Promise(resolve => {
      t2.onComplete(resolve);
      t1.chain(t2).start();
    });

  }


}
