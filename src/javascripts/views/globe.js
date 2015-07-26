

var _ = require('lodash');
var $ = require('jquery');
var Backbone = require('backbone');
var THREE = require('three');


module.exports = Backbone.View.extend({


  el: '#globe',


  /**
   * Start the globe.
   */
  initialize: function() {

    this._initScene();
    this._initResize();
    this._initSphere();

    this.fit()
    this.render()

  },


  /**
   * Create the scene and renderer.
   */
  _initScene: function() {

    // Create the scene.
    this.scene = new THREE.Scene();

    // Create the  renderer.
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.$el.append(this.renderer.domElement);

  },


  /**
   * On resize, re-fit the camera.
   */
  _initResize: function() {

    // Debounce the viewport fitter.
    var resize = _.debounce(this.fit.bind(this), 500);

    // Bind to resize.
    $(window).resize(resize);
    this.fit()

  },


  /**
   * Create a sphere for the earth.
   */
  _initSphere: function() {

    // DEV: Create a cube.
    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    this.cube = new THREE.Mesh(geometry, material);
    this.scene.add(this.cube);

  },


  /**
   * Fit the scene to the container.
   */
  fit: function() {

    // Measure container.
    var w = this.$el.width();
    var h = this.$el.height();

    // Create the camera.
    this.camera = new THREE.PerspectiveCamera(75, w/h, 0.1, 1000);
    this.camera.position.z = 10;

    // Size the renderer.
    this.renderer.setSize(w, h);

  },


  /**
   * Render the scene.
   */
  render: function() {
    window.requestAnimationFrame(this.render.bind(this));
    this.cube.rotation.x += 0.01;
    this.cube.rotation.y += 0.01;
    this.renderer.render(this.scene, this.camera);
  },


});
