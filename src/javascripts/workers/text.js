

import THREE from 'three';
import helvetiker from 'three.regular.helvetiker';


// Register the typeface.
THREE.typeface_js.loadFace(helvetiker);


export default (self) => {
  self.addEventListener('message', e => {

    // Create the text geometry.
    let geo = new THREE.TextGeometry(e.data.name, {
      curveSegments: 1,
      size: 30,
      font: 'helvetiker',
      height: 0,
    });

    self.postMessage({
      geo: geo.toJSON(),
      x: e.data.x,
      y: e.data.y,
      z: e.data.z,
    });

  });
};
