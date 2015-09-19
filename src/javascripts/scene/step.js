

import _ from 'lodash';


export default class {


  /**
   * Mix in the shared objects.
   *
   * @param {Scene} scene
   */
  constructor(scene) {
    _.extend(this, scene.getMixins());
  }


}
