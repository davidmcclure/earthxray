

import Radio from 'backbone.radio';

import {
  XRAY,
  TRACE_CENTER,
} from '../constants';


const channel = Radio.channel(XRAY);


/**
 * When the far-side intersection is traced.
 *
 * @param {Number} distance
 * @param {Number} bearing
 */
export function traceCenter(distance, bearing) {
  channel.trigger(TRACE_CENTER, distance, bearing);
}
