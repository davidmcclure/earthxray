

import { createReducer } from '../utils';

import {
  SHOW_GPS_ERROR,
  SHOW_ORIENTATION_ERROR,
} from '../constants';


const initialState = {
  gps: false,
  orientation: false,
};


const handlers = {

  [SHOW_GPS_ERROR]: () => ({
    gps: true
  }),

  [SHOW_ORIENTATION_ERROR]: () => ({
    orientation: true
  }),

};


export default createReducer(initialState, handlers);
