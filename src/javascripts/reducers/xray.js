

import { createReducer } from '../utils';
import * as constants from '../constants';


const initialState = {
  distance: null
};


const handlers = {

  [constants.XRAY_TRACE_CENTER]: (state, action) => ({
    distance: action.distance
  })

};


export default createReducer(initialState, handlers);
