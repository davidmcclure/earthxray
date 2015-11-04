

import Radio from 'backbone.radio';

import {
  POINT_CAMERA,
  TRACE_CENTER,
} from '../constants';


const channel = Radio.channel('xray');


/**
 * When the camera heading is updated.
 *
 * @param {Number} bearing
 */
export function pointCamera(bearing) {
  channel.trigger(POINT_CAMERA, bearing);
}


/**
 * When the far-side intersection is traced.
 *
 * @param {Number} distance
 */
export function traceCenter(distance) {
  channel.trigger(TRACE_CENTER, distance);
}
