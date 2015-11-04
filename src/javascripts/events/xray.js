

import Radio from 'backbone.radio';

import {
  TRACE_CENTER
} from '../constants';


const channel = Radio.channel('xray');


/**
 * When the far-side intersection is traced.
 *
 * @param {Number} distance
 */
export function traceCenter(distance) {
  channel.trigger(TRACE_CENTER, distance);
}
