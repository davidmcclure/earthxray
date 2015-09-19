

import { createReducer } from '../utils';

import {
  START_XRAY,
  TRACE_XRAY_CENTER,
} from '../constants';


const initialState = {
  active: false,
  distance: null,
};


const handlers = {

  [START_XRAY]: () => ({
    active: true
  }),

  [TRACE_XRAY_CENTER]: (state, action) => ({
    distance: action.distance
  }),

};


export default createReducer(initialState, handlers);
