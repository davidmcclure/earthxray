

import React from 'react';
import RadioComponent from '../lib/radio-component';
import classNames from 'classnames';

import {
  XRAY,
  START_CALIBRATION,
  END_CALIBRATION,
} from '../constants';


export default class extends RadioComponent {


  static events = {
    [XRAY]: {
      [START_CALIBRATION]: 'start',
      [END_CALIBRATION]: 'end',
    }
  }


  /**
   * Set initial state.
   * TODO
   */
  constructor(props) {

    super(props);

    this.state = {
      calibrating: false,
      success: false,
    };

  }


  /**
   * Start calibration.
   */
  start() {
    this.setState({
      calibrating: true,
    });
  }


  /**
   * End calibration.
   */
  end() {

    this.setState({
      calibrating: false,
      success: true,
    });

    setTimeout(() => {
      this.setState({
        success: false
      });
    }, 2000);

  }


  /**
   * Render the compass bearing.
   */
  render() {

    let content = null;

    if (this.state.calibrating) {
      content = (
        <div>
          <div className="calibrating">Calibrating compass...</div>
          <div className="instruction">Turn around slowly!</div>
        </div>
      );
    }

    else if (this.state.success) {
      content = (
        <div className="success">Success!</div>
      )
    }

    return (
      <div className="calibration">
        {content}
      </div>
    );

  }


}
