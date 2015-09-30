

import { createReducer } from '../utils';

import {
  TOGGLE_NAV,
} from '../constants';


const initialState = {
  active: false,
};


const handlers = {

  [TOGGLE_NAV]: (state) => ({
    active: !state.active
  }),

};


export default createReducer(initialState, handlers);
