

import React, { Component } from 'react';


export default class extends Component {


  /**
   * Render an error overlay.
   */
  render() {
    return (
      <div className="overlay">
        <div className="content animated flipInX">
          {this.props.children}
        </div>
      </div>
    );
  }


}
