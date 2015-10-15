

import React, { Component } from 'react';
import Overlay from './overlay';
import Logo from './logo';
import Static from './static';

import errorHTML from './error.html';


export default class extends Component {


  /**
   * Render the orientation error modal.
   */
  render() {
    return (
      <Overlay className="error">

        <Logo />

        <h1>Whoops, no accelerometer</h1>
        <Static html={errorHTML} />

      </Overlay>
    );
  }


}
