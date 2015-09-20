

import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';


export default class extends Component {


  /**
   * Render the GPS error modal.
   */
  render() {
    return (
      <Modal show={true}>
        <Modal.Body>
          <div className="alert alert-danger">
            <strong>Whoops, no GPS!</strong>
          </div>
        </Modal.Body>
      </Modal>
    );
  }


}
