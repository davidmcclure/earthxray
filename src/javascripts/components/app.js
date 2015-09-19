

import React, {Component} from 'react';
import Scene from './scene';
import Center from './center';


export default class extends Component {


  /**
   * Render the top-level application structure.
   */
  render() {
    return (
      <div className="wrapper">
        <Scene />
        <Center />
      </div>
    );
  }


}
