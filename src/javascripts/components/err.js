

import React, { Component, PropTypes } from 'react';
import Overlay from './overlay';
import Logo from './logo';
import Static from './static';

import errHTML from './err.html';


export default class extends Component {


  static propTypes = {
    msg: PropTypes.string.isRequired
  }


  /**
   * Render the orientation error modal.
   */
  render() {
    return (
      <Overlay className="error">

        <Logo />

        <h1>{this.props.msg}</h1>
        <Static html={errHTML} />

      </Overlay>
    );
  }


}
