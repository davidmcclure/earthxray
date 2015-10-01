

import React, { Component } from 'react';
import classNames from 'classnames';


export default class extends Component {


  /**
   * Render an error overlay.
   */
  render() {

    // Merge in passed classes.
    let cx = classNames('overlay', this.props.className);

    return (
      <div className={cx}>
        <div className="content animated flipInX">
          {this.props.children}
        </div>
      </div>
    );

  }


}
