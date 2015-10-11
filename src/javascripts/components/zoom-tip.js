

import React, { Component, findDOMElement } from 'react';
import Isvg from 'react-inlinesvg';
import classNames from 'classnames';


export default class extends Component {


  /**
   * Set initial state.
   *
   * @param {Object} props
   */
  constructor(props) {

    super(props);

    this.state = {
      pulse: false
    };

  }


  /**
   * Set the pulse interval.
   */
  componentDidMount() {
    this.interval = setInterval(this.pulse.bind(this), 3000);
  }


  /**
   * Clear the pulse interval.
   */
  componentWillUnmount() {
    clearInterval(this.interval);
  }


  /**
   * Pulse the tip.
   */
  pulse() {

    this.setState({ pulse: true });

    setTimeout(() => {
      this.setState({ pulse: false });
    }, 1000);

  }


  /**
   * Render the zoom tip.
   */
  render() {

    let cx = classNames('zoom-tip', 'animated', {
      bounceIn: this.state.pulse
    });

    return (
      <div className={cx}>
        <Isvg src="images/pinch.svg" />
        <span>Pinch to zoom</span>
      </div>
    );

  }


}
