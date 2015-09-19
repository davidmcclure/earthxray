

import {
  XRAY_START,
  XRAY_TRACE_CENTER
} from '../constants';


/**
 * When the VR starts.
 */
export function start() {
  return {
    type: XRAY_START,
  };
}


/**
 * When the far-side intersection is traced.
 *
 * @param {Number} distance
 */
export function traceCenter(distance) {
  return {
    type: XRAY_TRACE_CENTER,
    distance: distance,
  };
}