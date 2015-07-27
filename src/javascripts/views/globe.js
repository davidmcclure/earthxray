

var _ = require('lodash');
var $ = require('jquery');
var Backbone = require('backbone');
var THREE = require('three');
var utils = require('../utils');


module.exports = Backbone.View.extend({


  el: '#globe',


  /**
   * Start the globe.
   */
  initialize: function() {

    this._initScene();
    this._initResize();
    this._initSphere();

    this.render();

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

    // Top-level mesh group.
    this.world = new THREE.Object3D();
    this.scene.add(this.world);

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
    this.world.add(this.sphere);

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
   *
   * @param {Number} lat
   * @param {Number} lon
   */
  addLatLon: function(lat, lon) {

    // Degrees -> radians.
    rLat = utils.degToRad(lat);
    rLon = utils.degToRad(lon);

    // Coordinates -> X/Y/Z.
    var x = Math.cos(rLat) * Math.cos(rLon);
    var y = Math.cos(rLat) * Math.sin(rLon);
    var z = Math.sin(rLat);

    // Create the geometry.
    var geometry = new THREE.SphereGeometry(0.01, 10, 10);
    var material = new THREE.MeshBasicMaterial({
      color: 0x000000
    });

    // Register the mesh.
    var mesh = new THREE.Mesh(geometry, material);
    this.world.add(mesh);

    // Position the point.
    mesh.position.set(-x, z, y);

  },


  /**
   * Render the scene.
   */
  render: function() {

    // TODO|dev: Spin world.
    this.world.rotation.y += 0.003;

    // Render the new frame.
    window.requestAnimationFrame(this.render.bind(this));
    this.renderer.render(this.scene, this.camera);

  },


});
