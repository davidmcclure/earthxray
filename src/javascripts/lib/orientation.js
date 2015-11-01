

import _ from 'lodash';
import EventEmitter from 'events';
import THREE from 'three';


export default class Orientation extends EventEmitter {


  /**
   * Listen for orientation.
   */
  start() {

    window.addEventListener('deviceorientation', e => {
      this.data = e;
    });

    this.checkSupport();
    this.calibrateCompass();

  }


  /**
   * Does the device have an accelerometer?
   */
  checkSupport() {

    let check = (i=0) => {

      if (_.isNumber(_.get(this, 'data.alpha'))) {
        this.emit('supported');
      }

      else if (++i < 10) {
        _.delay(check, 50, i);
      }

      else {
        this.emit('unsupported');
      }

    };

    check();

  }


  /**
   * Calibrate the compass.
   */
  calibrateCompass() {

    let t = 0, maxt = 1000;
    let s = 0, maxs = 200;

    let calibrate = e => {

      if (e.absolute !== true && e.webkitCompassAccuracy > 0) {

        // Store the base heading.
        let heading = THREE.Math.degToRad(e.webkitCompassHeading);
        this.alphaOffset = new THREE.Euler(heading, 0, 0);

        // Stop after N successful samples.
        if (++s > maxs) {
          window.removeEventListener('deviceorientation', calibrate);
        }

      }

      // Stop after N attempts.
      if (++t > maxt) {
        window.removeEventListener('deviceorientation', calibrate);
      }

    };

    window.addEventListener('deviceorientation', calibrate);

  }


  /**
   * Get screen-adjusted Euler angles.
   *
   * @return {Object}
   */
  getEuler() {

    let euler = new THREE.Euler();

    let a = THREE.Math.degToRad(this.data.alpha);
    let b = THREE.Math.degToRad(this.data.beta);
    let g = THREE.Math.degToRad(this.data.gamma);

    euler.set(a, b, g);

    return euler;

  }


}
