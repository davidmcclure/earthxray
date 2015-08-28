

import THREE from 'three';
import helvetiker from 'three.regular.helvetiker';


// Register the typeface.
THREE.typeface_js.loadFace(helvetiker);


export default class Text {


  /**
   * Initialize the character cache.
   */
  constructor() {
    this.chars = {};
  }


  /**
   * Render a text string.
   *
   * @param {String} text
   */
  render(text) {

    let meshes = [];

    let material = new THREE.MeshBasicMaterial({
      color: 0x000000
    });

    let offset = 0;

    for (let c of text) {

      if (!this.chars[c]) {
        this.chars[c] = new THREE.TextGeometry(c, {
          curveSegments: 1,
          size: 30,
          font: 'helvetiker',
          height: 0,
        });
      }

      let mesh = new THREE.Mesh(this.chars[c]);
      let size = new THREE.Box3().setFromObject(mesh).size();
      mesh.position.x += offset+5;

      meshes.push(mesh);
      offset += size.x;

    }

    let geometry = new THREE.Geometry();

    for (let mesh of meshes) {
      THREE.GeometryUtils.merge(geometry, mesh);
    }

    return new THREE.Mesh(geometry, material);

  }


}
