

import { createReducer } from '../utils';

import {
  START_XRAY,
  ZOOM_XRAY,
  START_CALIBRATING,
  END_CALIBRATING,
} from '../constants';


const initialState = {
  active: false,
  isCalibrating: false,
  hasZoomed: false,
};


const handlers = {

  [START_XRAY]: () => ({
    active: true
  }),

  [ZOOM_XRAY]: () => ({
    hasZoomed: true
  }),

  [START_CALIBRATING]: () => ({
    isCalibrating: true
  }),

  [END_CALIBRATING]: () => ({
    isCalibrating: false
  }),

};


export default createReducer(initialState, handlers);
