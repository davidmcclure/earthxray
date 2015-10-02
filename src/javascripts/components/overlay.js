

import React, { Component } from 'react';
import classNames from 'classnames';


export default class extends Component {


  static defaultProps = {
    animation: 'flipInX'
  }


  /**
   * Render an error overlay.
   */
  render() {

    let wrapperCx = classNames(
      'overlay',
      this.props.className
    );

    let contentCx = classNames(
      'content',
      'animated',
      this.props.animation
    );

    return (
      <div className={wrapperCx}>
        <div className={contentCx}>
          {this.props.children}
        </div>
      </div>
    );

  }


}
