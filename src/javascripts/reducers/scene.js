

import { createReducer } from '../utils';

import {
  GEOLOCATE,
  FINISH_STARTUP,
  FINISH_ZOOM,
} from '../constants';


const initialState = {

  location: null,

  drivers: {
    startup: true
  },

};


const handlers = {

  [GEOLOCATE]: (state, action) => ({
    location: action.location
  }),

  [FINISH_STARTUP]: () => ({
    drivers: {
      zoom: true
    }
  }),

  [FINISH_ZOOM]: () => ({
    drivers: {
      xray: true
    }
  }),

};


export default createReducer(initialState, handlers);
