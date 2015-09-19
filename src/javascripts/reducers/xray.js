

import { createReducer } from '../utils';
import { XRAY_TRACE_CENTER } from '../constants';


const initialState = {
  active: false,
  distance: null,
};


const handlers = {

  [XRAY_TRACE_CENTER]: (state, action) => ({
    distance: action.distance
  })

};


export default createReducer(initialState, handlers);
