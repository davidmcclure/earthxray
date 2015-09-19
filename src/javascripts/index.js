

import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducers from './reducers';
import App from './components/app';


export const store = createStore(reducers);


React.render(

  <Provider store={store}>
    {() => <App />}
  </Provider>,

  document.getElementById('root')

);
