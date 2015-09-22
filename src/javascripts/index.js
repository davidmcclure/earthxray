

import React from 'react';
import { Provider } from 'react-redux';
import store from './store';
import App from './components/app';


React.render(

  <Provider store={store}>
    {() => <App />}
  </Provider>,

  document.getElementById('root')

);
