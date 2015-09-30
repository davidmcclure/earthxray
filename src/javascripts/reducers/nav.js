

import { createReducer } from '../utils';

import {
  START_XRAY,
  TOGGLE_NAV,
} from '../constants';


const initialState = {
  active: false,
};


const handlers = {

  [START_XRAY]: () => ({
    active: true
  }),

  [TOGGLE_NAV]: (state) => ({
    active: !state.active
  }),

};


export default createReducer(initialState, handlers);
