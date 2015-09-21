

import {
  START_XRAY,
  TRACE_XRAY_CENTER
} from '../constants';


/**
 * When the VR starts.
 */
export function startXray() {
  return {
    type: START_XRAY,
  };
}


/**
 * When the far-side intersection is traced.
 *
 * @param {Number} distance
 */
export function traceCenter(distance) {
  return {
    type: TRACE_XRAY_CENTER,
    distance: distance,
  };
}
