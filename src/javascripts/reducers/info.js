

import { createReducer } from '../utils';

import {
  START_XRAY,
  TOGGLE_INFO,
} from '../constants';


const initialState = {
  active: false,
};


const handlers = {

  [START_XRAY]: () => ({
    active: true
  }),

  [TOGGLE_INFO]: (state) => ({
    active: !state.active
  }),

};


export default createReducer(initialState, handlers);
