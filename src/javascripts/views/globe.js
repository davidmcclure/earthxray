

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

    this.render()

    // TODO|dev
    this.addLonLat(0, 0)

  },


  /**
   * Create the scene and renderer.
   */
  _initScene: function() {

    // Create the scene.
    this.scene = new THREE.Scene();

    // Create the renderer.
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });

    // Inject the <canvas>.
    this.$el.append(this.renderer.domElement);

  },


  /**
   * On resize, re-fit the camera.
   */
  _initResize: function() {

    // Debounce the viewport fitter.
    var resize = _.debounce(this.fitWindow.bind(this), 500);

    // Bind to resize.
    $(window).resize(resize);
    this.fitWindow()

  },


  /**
   * Create a sphere for the earth.
   */
  _initSphere: function() {

    // Create geometry.
    var geometry = new THREE.SphereGeometry(1, 32, 32);

    // Create wireframe material.
    var material = new THREE.MeshBasicMaterial({
      color: 0x2a7bbf,
      wireframeLinewidth: 0.5,
      wireframe: true,
    });

    // Register the mesh.
    this.sphere = new THREE.Mesh(geometry, material);
    this.scene.add(this.sphere);

  },


  /**
   * Fit the scene to the container.
   */
  fitWindow: function() {

    // Measure container.
    var w = this.$el.width();
    var h = this.$el.height();

    // Create the camera.
    this.camera = new THREE.PerspectiveCamera(75, w/h, 0.1, 1000);
    this.camera.position.z = 2;

    // Size the renderer.
    this.renderer.setSize(w, h);

  },


  /**
   * Render a geograpic coordinate.
   */
  addLonLat: function(lon, lat) {

    var x = Math.cos(lon) * Math.cos(lat);
    var y = Math.cos(lon) * Math.sin(lat);
    var z = Math.sin(lon);

    console.log(x, y, z);

  },


  /**
   * Render the scene.
   */
  render: function() {

    // TODO|dev: Spin sphere.
    this.sphere.rotation.y += 0.003;

    // Render the new frame.
    window.requestAnimationFrame(this.render.bind(this));
    this.renderer.render(this.scene, this.camera);

  },


});
