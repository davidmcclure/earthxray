

import TWEEN from 'tween.js';
import THREE from 'three';
import Promise from 'bluebird';

import Step from './step';
import * as utils from '../utils';


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

    // Get the target point.
    let [x, y, z] = utils.lonLatToXYZ(
      this.shared.location.longitude,
      this.shared.location.latitude
    );

    return new Promise((resolve, reject) => {

      new TWEEN.Tween(this.camera.position)

        // Zoom to the location.
        .to({ x:x, y:y, z:z }, 5000)
        .easing(TWEEN.Easing.Quadratic.Out)

        // Swivel around the center.
        .onUpdate(() => {
          this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        })

        .onComplete(resolve)
        .start();

    });

  }


}
