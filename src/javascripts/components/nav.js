

import { connect } from 'react-redux';
import React, { Component } from 'react';
import classNames from 'classnames';
import Tappable from 'react-tappable';
import * as actions from '../actions/nav';
import Overlay from './overlay';
import Content from './content';
import linksHTML from '../content/links.html';
import infoHTML from '../content/info.html';


@connect(
  state => state.nav,
  actions
)
export default class extends Component {


  /**
   * Render navigation.
   */
  render() {

    let info = null;

    if (this.props.active) {
      info = (
        <Overlay className="info" animation="zoomIn">

          <Content markup={infoHTML} />

          <Tappable onTap={this.props.toggleNav}>
            <button className="btn btn-primary btn-lg">Got it</button>
          </Tappable>

          <Content markup={linksHTML} />

        </Overlay>
      );
    }

    let wrapperCx = classNames('nav', {
      active: this.props.active
    });

    let toggleCx = classNames('toggle', 'fa', {
      'fa-bars': !this.props.active,
      'fa-times-circle': this.props.active,
    });

    return (
      <div className={wrapperCx}>

        <Tappable onTap={this.props.toggleNav}>
          <i className={toggleCx}></i>
        </Tappable>

        {info}

      </div>
    );

  }


}
