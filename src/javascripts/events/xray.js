

import Radio from 'backbone.radio';

import {
  TRACE_XRAY_CENTER
} from '../constants';


const channel = Radio.channel('xray');


/**
 * When the far-side intersection is traced.
 *
 * @param {Number} distance
 */
export function traceXrayCenter(distance) {
  channel.trigger(TRACE_XRAY_CENTER, distance);
}
