

import {
  GEOLOCATE,
  FINISH_STARTUP,
  FINISH_ZOOM
} from '../constants';


/**
 * When a GPS location is acquired.
 *
 * @param {Array} location
 */
export function geolocate(location) {
  return {
    type: GEOLOCATE,
    location: location,
  };
}


/**
 * When startup finishes.
 */
export function finishStartup() {
  return {
    type: FINISH_STARTUP,
  };
}


/**
 * When the zoom finishes.
 */
export function finishZoom() {
  return {
    type: FINISH_ZOOM,
  };
}
