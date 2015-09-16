

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

    // intersection with pivot sphere

    let r = this.camera.position.z;

    let [gx, gy, gz] = utils.lonLatToXYZ(
      this.shared.location.longitude,
      this.shared.location.latitude
    );

    let a = gx*gx + gy*gy + gz*gz;
    let b = 2*gz;
    let c = -r*r;

    let t = (-b + Math.sqrt(b*b - 4*a*c)) / (2*a);

    let x = t*gx;
    let y = t*gy;
    let z = t*gz;

    // get start / end coordinates

    let [lon1, lat1] = utils.xyzToLonLat(
      this.camera.position.x,
      this.camera.position.y,
      this.camera.position.z,
      r
    );

    let [lon2, lat2] = utils.xyzToLonLat(x, y, z, r);

    // interpolate points

    let points = [];
    for (let i of _.range(21)) {

      let [lon, lat] = utils.intermediatePoint(
        lon1, lat1, lon2, lat2, i/20
      );

      let [x, y, z] = utils.lonLatToXYZ(lon, lat, r);

      points.push(new THREE.Vector3(x, y, z));

    }

    let spline = new THREE.SplineCurve3(points);

    // animate the camera

    let camera = this.camera;

    let t1 = new TWEEN.Tween({ ratio: 0 })
      .to({ ratio: 1 }, 3000)
      .easing(TWEEN.Easing.Quadratic.Out)
      .onUpdate(function() {
        camera.position.copy(spline.getPoint(this.ratio))
        camera.lookAt(new THREE.Vector3(0, 0, 0));
      });

    let t2 = new TWEEN.Tween(this.camera.position)

      // Zoom to the location.
      .to({ x:gx, y:gy, z:gz }, 2000)
      .easing(TWEEN.Easing.Quadratic.Out)

      // Swivel around the center.
      .onUpdate(() => {
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
      })

    t1.chain(t2);
    t1.start();

  }


}
