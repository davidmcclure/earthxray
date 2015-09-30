

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
