

import { connect } from 'react-redux';
import React, { Component } from 'react';
import classNames from 'classnames';
import Tappable from 'react-tappable';
import * as actions from '../actions/nav';
import Info from './info';


@connect(
  state => state.nav,
  actions
)
export default class extends Component {


  /**
   * Render navigation.
   */
  render() {

    let cx = classNames('nav', {
      active: this.props.active
    });

    return (
      <div className={cx}>

        <Tappable onTap={this.toggle.bind(this)}>
          <i className="toggle fa fa-bars"></i>
        </Tappable>

        {this.props.active ? <Info /> : null}

      </div>
    );

  }


  /**
   * Toggle the info.
   */
  toggle() {
    this.props.toggleNav();
  }


}
