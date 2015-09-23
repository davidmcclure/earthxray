

import { createReducer } from '../utils';

import {
  GEOLOCATE,
  FINISH_STARTUP,
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

};


export default createReducer(initialState, handlers);
