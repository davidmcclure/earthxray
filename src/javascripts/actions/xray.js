

import { TRACE_CENTER } from '../constants';


/**
 * When the far-side intersection is traced.
 *
 * @param {Number} distance
 */
export function traceCenter(distance) {
  return {
    type: TRACE_CENTER,
    distance: distance,
  };
}
