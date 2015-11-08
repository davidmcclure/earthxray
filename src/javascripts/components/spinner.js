

import _ from 'lodash';
import React, { Component } from 'react';
import classNames from 'classnames';


export default class extends Component {


  /**
   * Render a loading spinner.
   */
  render() {

    let circles = _.range(1, 13).map(function(i) {
      let cx = classNames('sk-child', `sk-circle${i}`);
      return <div key={i} className={cx}></div>;
    });

    return (
      <div className="sk-circle">
        {circles}
      </div>
    );

  }


}
