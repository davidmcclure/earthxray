

import {
  TOGGLE_NAV,
} from '../constants';


/**
 * When the navigation is toggled.
 */
export function toggleNav() {
  return {
    type: TOGGLE_NAV,
  };
}
