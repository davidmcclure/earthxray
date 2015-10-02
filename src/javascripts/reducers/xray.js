

import { createReducer } from '../utils';

import {
  START_XRAY,
} from '../constants';


const initialState = {
  active: false,
  hasZoomed: false,
};


const handlers = {

  [START_XRAY]: () => ({
    active: true
  }),

  [ZOOM_XRAY]: () => ({
    hasZoomed: true
  }),

};


export default createReducer(initialState, handlers);
