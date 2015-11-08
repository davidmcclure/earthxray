

import { connect} from 'react-redux';
import React from 'react';
import RadioComponent from '../lib/radio-component';
import classNames from 'classnames';

import {
  XRAY,
  START_CALIBRATION,
  END_CALIBRATION,
} from '../constants';


@connect(state => ({
  calibrating: state.xray.calibrating
}))
export default class extends RadioComponent {


  /**
   * Set initial state.
   */
  constructor(props) {

    super(props);

    this.state = {
      success: false,
    };

  }


  /**
   * When calibration starts / stops.
   *
   * @param {Object} prevProps
   */
  componentDidUpdate(prevProps) {

    if (prevProps.calibrating && !this.props.calibrating) {

      // Flash success.
      this.setState({ success: true });

      // Hide after 2s.
      setTimeout(() => {
        this.setState({ success: false });
      }, 3000);

    }

  }


  /**
   * Render the compass bearing.
   */
  render() {

    let content = null;

    if (this.props.calibrating) {
      content = (
        <div className="waiting">

          <div className="pulse"></div>

          <div className="sampling">
            Calibrating compass...
          </div>

          <div className="tip">Turn around slowly!</div>

        </div>
      );
    }

    else if (this.state.success) {
      content = (
        <div className="success">
          <i className="fa fa-2x fa-check-circle"></i>
          <div>Success!</div>
        </div>
      )
    }

    return (
      <div id="calibration">
        {content}
      </div>
    );

  }


}
