

import _ from 'lodash';


export default class Step {


  /**
   * Mix in the shared objects.
   *
   * @param {Scene} scene
   */
  constructor(scene) {
    _.extend(this, scene.getMixins());
  }


}
