

import _ from 'lodash';
import TWEEN from 'tween.js';
import THREE from 'three';
import Promise from 'bluebird';

import Step from './step';


export default class extends Step {


  /**
   * Zoom the camera into place.
   *
   * @return {Promise}
   */
  start() {
    return new Promise(resolve => {

      let [x, y, z] = this.shared.location;

      new TWEEN.Tween(this.camera.position)

        .to({ x:x, y:y, z:z }, 5000)
        .easing(TWEEN.Easing.Quadratic.Out)

        .onUpdate(() => {
          this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        })

        .onComplete(resolve)
        .start();

    });
  }


}
