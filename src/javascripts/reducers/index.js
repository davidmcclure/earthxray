

import { combineReducers } from 'redux';
import scene from './scene';
import errors from './errors';
import nav from './nav';
import xray from './xray';


export default combineReducers({
  scene,
  errors,
  nav,
  xray,
});
