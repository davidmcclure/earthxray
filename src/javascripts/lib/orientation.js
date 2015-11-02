

import _ from 'lodash';
import EventEmitter from 'events';
import THREE from 'three';


export default class Orientation extends EventEmitter {


  constructor() {
    super();
    this.initScreenAngle();
  }


  /**
   * Set the initial screen angle.
   */
  initScreenAngle() {

    // Check for API.
    let angle = _.get(window, 'screen.orientation.angle')
    this.hasScreenAngleAPI = _.isNumber(angle);

    this.setScreenAngle();

  }


  /**
   * Get the current screen angle.
   *
   * @return {Number}
   */
  getScreenAngle() {

    return this.hasScreenAngleAPI ?
      (window.screen.orientation.angle || 0) :
      (window.orientation || 0);

  }


  /**
   * Set the current screen angle.
   */
  setScreenAngle() {
    this.screenAngle = this.getScreenAngle();
  }


  /**
   * Listen for orientation.
   */
  start() {

    window.addEventListener(
      'deviceorientation',
      this.setOrientationData.bind(this)
    );

    window.addEventListener(
      'orientationchange',
      this.setScreenAngle.bind(this)
    );

    this.checkSupport();
    this.calibrateCompass();

  }


  /**
   * Set the raw orientation data.
   *
   * @param {Object} data
   */
  setOrientationData(data) {
    this.data = data;
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
    let s = 0, maxs = 100;

    let calibrate = e => {

      if (e.absolute !== true && e.webkitCompassAccuracy > 0) {

        if (s == 0) {
          this.emit('startcalibration');
        }

        // Stop after N successful samples.
        if (++s > maxs) {

          // Store the base heading.
          this.heading = e.webkitCompassHeading;
          // TODO: Store screen rotation.

          // Strip off the listener.
          window.removeEventListener('deviceorientation', calibrate);
          this.emit('endcalibration');

        }

      }

      // Stop after N attempts.
      if (++t > maxt) {

        window.removeEventListener('deviceorientation', calibrate);

        // If calibration started, notify failure.
        if (s !== 0) {
          this.emit('failcalibration');
        }

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

    let alpha = this.data.alpha - (this.heading || 0);

    // TODO: Screen rotation.

    return {
      alpha:  alpha,
      beta:   this.data.beta,
      gamma:  this.data.gamma,
    };

  }


}
