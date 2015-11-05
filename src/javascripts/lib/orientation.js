

import _ from 'lodash';
import EventEmitter from 'events';
import THREE from 'three';
import Promise from 'bluebird';


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

    let angle = this.hasScreenAngleAPI ?
      (window.screen.orientation.angle || 0) :
      (window.orientation || 0);

    return THREE.Math.degToRad(angle);

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
   * Is the device reporting data?
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

      if (e.absolute !== true && _.isNumber(e.webkitCompassHeading)) {

        if (s == 0) {
          this.emit('startcalibration');
        }

        // Stop after N successful samples.
        if (++s >= maxs) {

          // Store the base heading.
          this.heading = e.webkitCompassHeading;

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
   * Get the current compass bearing.
   *
   * @return {Number}
   */
  getCompassBearing() {

    let alpha = this.data.alpha - (this.heading || 0);
    if (alpha < 0) alpha += 360;

    return alpha;

  }


  /**
   * Get a screen-adjusted rotation matrix.
   *
   * @return {THREE.Matrix4}
   */
  getRotationMatrix() {

    let alpha = this.getCompassBearing();

    let a = THREE.Math.degToRad(alpha);
    let b = THREE.Math.degToRad(this.data.beta);
    let g = THREE.Math.degToRad(this.data.gamma);

    let ra = new THREE.Matrix4();
    let rb = new THREE.Matrix4();
    let rg = new THREE.Matrix4();
    let rs = new THREE.Matrix4();

    ra.makeRotationZ(a);
    rb.makeRotationX(b);
    rg.makeRotationY(g);

    // Adjust for screen angle.
    rs.makeRotationZ(-this.screenAngle);

    let matrix = new THREE.Matrix4();

    matrix.multiply(ra);
    matrix.multiply(rb);
    matrix.multiply(rg);
    matrix.multiply(rs);

    return matrix;

  }


}
