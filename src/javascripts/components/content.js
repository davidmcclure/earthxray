

import React, { Component } from 'react';


export default class extends Component {


  /**
   * Render static content.
   */
  render() {
    return <div dangerouslySetInnerHTML={{
      __html: this.props.markup
    }} />
  }


}
