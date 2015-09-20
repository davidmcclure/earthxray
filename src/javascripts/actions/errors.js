

import {
  SHOW_GPS_ERROR,
  SHOW_ORIENTATION_ERROR
} from '../constants';


/**
 * When geolocation fails.
 */
export function showGPSError() {
  return {
    type: SHOW_GPS_ERROR,
  };
}


/**
 * When `deviceorientation` fails.
 */
export function showOrientationError() {
  return {
    type: SHOW_ORIENTATION_ERROR,
  };
}
