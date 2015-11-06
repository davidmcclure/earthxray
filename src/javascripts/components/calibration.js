

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
   * TODO
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
      }, 2000);

    }

  }


  /**
   * Render the compass bearing.
   */
  render() {

    console.log(this.props);

    let content = null;

    if (this.props.calibrating) {
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
