

import {
  START_XRAY,
  ZOOM_XRAY,
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
 * When scene is zoomed.
 */
export function zoomXray() {
  return {
    type: ZOOM_XRAY,
  };
}
