

import {
  GEOLOCATE,
  FINISH_STARTUP
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
