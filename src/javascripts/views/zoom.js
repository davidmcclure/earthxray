

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

    // TODO|dev

    let r = opts.earth.radius;
    let diameter = this.camera.position.z *2;
    let rsphere = diameter/2

    var geometry = new THREE.SphereGeometry(rsphere, 64, 64);

    var material = new THREE.MeshBasicMaterial({
      color: 0xdddddd,
      wireframeLineWidth: 1,
      wireframe: true,
    });

    let sphere = new THREE.Mesh(geometry, material);

    let cz = this.camera.position.z - diameter/2;
    //sphere.position.z = cz;

    this.world.add(sphere);

    // find the intersection of center -> location line and the orbit sphere
    // find great arc from camera position
    // interpolate points along the path
    // build out the spline

    // http://www.ccs.neu.edu/home/fell/CSU540/programs/RayTracingFormulas.htm

    // get the destination point

    // 3D location point.
    let [dx, dy, dz] = utils.lonLatToXYZ(
      this.shared.location.longitude,
      this.shared.location.latitude
    );

    let cx = 0, cy = 0;

    var a = dx*dx + dy*dy + dz*dz;
    var b = 2*dz;
    var c = -rsphere*rsphere;

    let t = (-b + Math.sqrt(b*b - 4*a*c)) / (2*a);

    let x = t*dx;
    let y = t*dy;
    let z = t*dz;

    // draw dot

    var geometry = new THREE.SphereGeometry(500, 32, 32);

    var material = new THREE.MeshBasicMaterial({
      color: 0xff0000
    });

    var dot = new THREE.Mesh(geometry, material);
    dot.position.set(x, y, z);

    this.world.add(dot);

    // get lon/lats for start / end points.

    let [lon1, lat1] = utils.xyzToLonLat(this.camera.position.x, this.camera.position.y, this.camera.position.z, rsphere);
    let [lon2, lat2] = utils.xyzToLonLat(x, y, z, rsphere);

    // get great circle distance

    let φ1 = THREE.Math.degToRad(lat1);
    let φ2 = THREE.Math.degToRad(lat2);
    let λ1 = THREE.Math.degToRad(lon1);
    let λ2 = THREE.Math.degToRad(lon2);
    let Δφ = THREE.Math.degToRad(lat2-lat1);
    let Δλ = THREE.Math.degToRad(lon2-lon1);

    var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);

    // angular distance
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = rsphere * c;

    // get midpoint

    var a = Math.cos(φ1) * Math.cos(φ2);
    var b = Math.sin(0*c) / Math.sin(c);
    let mx = a * Math.cos(φ1) * Math.cos(λ1) + b * Math.cos(φ2) * Math.cos(λ2);
    let my = a * Math.cos(φ1) * Math.sin(λ1) + b * Math.cos(φ2) * Math.sin(λ2);
    let mz = a * Math.sin(φ1) + b * Math.sin(φ2);
    let mφ = Math.atan2(mz, Math.sqrt(mx*mx + my*my));
    let mλ = Math.atan2(my, mx);

    let [xi, yi, zi] = utils.lonLatToXYZ(
      THREE.Math.radToDeg(mλ),
      THREE.Math.radToDeg(mφ),
      rsphere
    );

    // plot midpoint

    var geometry = new THREE.SphereGeometry(500, 32, 32);

    var material = new THREE.MeshBasicMaterial({
      color: 0xff0000
    });

    var dot = new THREE.Mesh(geometry, material);
    dot.position.set(xi, yi, zi);

    this.world.add(dot);

    this.camera.position.set(0, 20000, 0);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));

  }


}
