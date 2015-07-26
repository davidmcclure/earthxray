

var Backbone = require('backbone');
var THREE = require('three');


module.exports = Backbone.View.extend({


  el: '#globe',


  /**
   * Start the globe.
   */
  initialize: function() {
    this._initSphere();
  },


  /**
   * DEV: Create a sphere for the earth.
   */
  _initSphere: function() {

    // Measure container.
    w = this.$el.width();
    h = this.$el.height();

    // Create camera and scene.
    this.camera = new THREE.PerspectiveCamera(75, w/h, 0.1, 1000);
    this.scene = new THREE.Scene();

    // Initialize renderer.
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(w, h);

    // Add renderer to container.
    this.$el.append(this.renderer.domElement);

    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    this.cube = new THREE.Mesh(geometry, material);
    this.scene.add(this.cube);

    this.camera.position.z = 5;
    this.render()

  },


  /**
   * DEV: Render the scene.
   */
  render: function() {
    window.requestAnimationFrame(this.render.bind(this));
    this.cube.rotation.x += 0.01;
    this.cube.rotation.y += 0.01;
    this.renderer.render(this.scene, this.camera);
  },


});
