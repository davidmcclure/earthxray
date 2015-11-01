

import _ from 'lodash';
import EventEmitter from 'events';
import Promise from 'bluebird';


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
        this.heading = e.webkitCompassHeading;

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

    // TODO|dev

    let alpha = this.data.alpha - (this.heading || 0);

    return {
      alpha,
      beta:   this.data.beta,
      gamma:  this.data.gamma,
    };

  }


}
