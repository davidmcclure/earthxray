

import classNames from 'classnames';
import React, { Component, findDOMElement } from 'react';
import Static from './static';

import pinchSVG from '../images/pinch.svg';


export default class extends Component {


  /**
   * Set initial state.
   *
   * @param {Object} props
   */
  constructor(props) {

    super(props);

    this.state = {
      pulse: false,
      flash: false,
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

    this.setState({ pulse: true, flash: true });

    setTimeout(() => {
      this.setState({ flash: false });
    }, 300);

    setTimeout(() => {
      this.setState({ pulse: false });
    }, 1000);

  }


  /**
   * Render the zoom tip.
   */
  render() {

    let cx = classNames('zoom-tip', {
      animated: this.state.pulse,
      bounceIn: this.state.pulse,
      flash: this.state.flash,
    });

    return (
      <div className={cx}>
        <Static html={pinchSVG} />
        <p>Pinch to zoom</p>
      </div>
    );

  }


}
