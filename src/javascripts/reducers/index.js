

import { combineReducers } from 'redux';
import scene from './scene';
import errors from './errors';
import xray from './xray';


export default combineReducers({
  scene,
  errors,
  xray,
});
