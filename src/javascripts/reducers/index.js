

import { combineReducers } from 'redux';
import scene from './scene';
import errors from './errors';
import info from './info';
import xray from './xray';


export default combineReducers({
  scene,
  errors,
  info,
  xray,
});
