

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
    // TODO
  }


}
