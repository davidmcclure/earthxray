

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

    let d = this.camera.position.z + (opts.earth.radius*1.5);
    let r = d/2;

    let cx = 0;
    let cy = 0;
    let cz = this.camera.position.z - r;

    let x0 = 0;
    let y0 = 0;
    let z0 = 0;

    let [dx, dy, dz] = utils.lonLatToXYZ(
      this.shared.location.longitude,
      this.shared.location.latitude
    );

    let a = dx*dx + dy*dy + dz*dz;;
    let b = 2*dx*(x0-cx) +  2*dy*(y0-cy) +  2*dz*(z0-cz);
    let c = cx*cx + cy*cy + cz*cz + x0*x0 + y0*y0 + z0*z0 + -2*(cx*x0 + cy*y0 + cz*z0) - r*r;

    let t = (-b + Math.sqrt(b*b - 4*a*c)) / (2*a);

    let x = t*dx;
    let y = t*dy;
    let z = t*dz;

    let geometry = new THREE.SphereGeometry(500, 32, 32);
    let material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    let mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    this.world.add(mesh);

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

    let camera = this.camera;

    let t1 = new TWEEN.Tween({ f: 0 })

      // Zoom to pivot sphere end point.
      .to({ f: 1 }, 3000)
      .easing(TWEEN.Easing.Quadratic.Out)

      // Keep the camera pointed at the center.
      .onUpdate(function() {
        camera.position.copy(spline.getPoint(this.f))
        camera.lookAt(new THREE.Vector3(0, 0, 0));
      });

    let t2 = new TWEEN.Tween(this.camera.position)

      // Zoom to GPS location.
      .to({ x:dx, y:dy, z:dz }, 2000)
      .easing(TWEEN.Easing.Quadratic.Out);

    t1.chain(t2).start();

  }


}
