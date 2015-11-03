

import { connect } from 'react-redux';
import React, { Component } from 'react';
import classNames from 'classnames';
import Tappable from 'react-tappable';
import * as actions from '../actions/info';
import Overlay from './overlay';
import Logo from './logo';
import Static from './static';

import ribbonHTML from './ribbon.html';
import infoHTML from './info.html';
import linksHTML from './links.html';


@connect(
  state => state.info,
  actions
)
export default class extends Component {


  /**
   * Render info.
   */
  render() {

    let info = null;

    if (this.props.active) {
      info = (
        <div>

          <Static html={ribbonHTML} />

          <Overlay>

            <Logo />
            <Static html={infoHTML} />

            <Tappable onTap={this.props.toggleInfo}>
              <button className="btn btn-primary btn-lg">Got it</button>
            </Tappable>

            <Static html={linksHTML} className="social" />

          </Overlay>

        </div>
      );
    }

    let wrapperCx = classNames({
      active: this.props.active
    });

    let toggleCx = classNames('toggle', 'fa', {
      'fa-bars': !this.props.active,
      'fa-times-circle': this.props.active,
    });

    return (
      <div id="info" className={wrapperCx}>

        <Tappable onTap={this.props.toggleInfo}>
          <i className={toggleCx}></i>
        </Tappable>

        {info}

      </div>
    );

  }


}
