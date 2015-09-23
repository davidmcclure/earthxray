

import { createStore } from 'redux';
import reducers from './reducers';


const store = createStore(reducers);


// TODO|dev
store.subscribe(function() {
  console.log(store.getState());
});


export default store;
