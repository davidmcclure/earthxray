

import {
  START_XRAY,
} from '../constants';


/**
 * When the VR starts.
 */
export function startXray() {
  return {
    type: START_XRAY,
  };
}
