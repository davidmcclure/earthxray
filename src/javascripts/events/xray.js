

import Radio from 'backbone.radio';

import {
  XRAY,
  TRACE_CENTER,
  START_CALIBRATION,
  END_CALIBRATION,
} from '../constants';


const channel = Radio.channel(XRAY);


/**
 * When the far-side intersection is traced.
 *
 * @param {Number} distance
 * @param {Number} bearing
 */
export function traceCenter(distance, bearing) {
  channel.trigger(TRACE_CENTER, distance, bearing);
}


/**
 * When compass calibration starts.
 */
export function startCalibration() {
  channel.trigger(START_CALIBRATION);
}


/**
 * When compass calibration ends.
 */
export function endCalibration() {
  channel.trigger(END_CALIBRATION);
}
