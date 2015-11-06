

import { createReducer } from '../utils';

import {
  START_XRAY,
  ZOOM_XRAY,
  START_CALIBRATION,
  END_CALIBRATION,
} from '../constants';


const initialState = {
  active: false,
  calibrating: false,
  hasZoomed: false,
};


const handlers = {

  [START_XRAY]: () => ({
    active: true
  }),

  [ZOOM_XRAY]: () => ({
    hasZoomed: true
  }),

  [START_CALIBRATION]: () => ({
    calibrating: true
  }),

  [END_CALIBRATION]: () => ({
    calibrating: false
  }),

};


export default createReducer(initialState, handlers);
