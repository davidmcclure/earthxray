

import { combineReducers } from 'redux';
import xray from './xray';
import errors from './errors';


export default combineReducers({
  xray,
  errors,
});
