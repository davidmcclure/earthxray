

import _ from 'lodash';
import EventEmitter from 'events';
import Promise from 'bluebird';


export default class Orientation extends EventEmitter {


  /**
   * Listen for orientation.
   */
  start() {

    // top-level listener

    window.addEventListener('deviceorientation', e => {
      this.data = e;
    });

    // calibration

    let t = 0, maxt = 1000;
    let s = 0, maxs = 200;

    let calibrate = e => {

      if (e.absolute !== true && e.webkitCompassAccuracy > 0) {

        this.compassHeading = e.webkitCompassHeading

        if (++s > maxs) {
          window.removeEventListener('deviceorientation', calibrate);
          alert(this.compassHeading);
        }

      }

      if (++t > maxt) {
        window.removeEventListener('deviceorientation', calibrate);
      }

    };

    window.addEventListener('deviceorientation', calibrate);

    // is there an accelerometer?

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
   * Get screen-adjusted Euler angles.
   *
   * @return {Object}
   */
  getEuler() {
    // TODO|dev
    return {
      alpha: this.compassHeading ? this.data.alpha - this.compassHeading : this.data.alpha,
      beta: this.data.beta,
      gamma: this.data.gamma,
    };
  }


}
