

import {
  START_XRAY,
  ZOOM_XRAY,
  START_CALIBRATION,
  END_CALIBRATION,
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


/**
 * When compass calibration starts.
 */
export function startCalibration() {
  return {
    type: START_CALIBRATION,
  };
}


/**
 * When compass calibration ends.
 */
export function endCalibration() {
  return {
    type: END_CALIBRATION,
  };
}
