

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

    this.render();

    // TODO|dev
    this.addLonLat(40.72842, -73.93593);
    this.addLonLat(40.73323, -125.09926);

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
   * @param {Number} lon
   * @param {Number} lat
   */
  addLonLat: function(lon, lat) {

    // lon/lat -> x/y/z
    var x = Math.cos(lat) * Math.cos(lon);
    var y = Math.cos(lat) * Math.sin(lon);
    var z = Math.sin(lat);

    // Create the geometry.
    var geometry = new THREE.SphereGeometry(0.01, 5, 5);
    var material = new THREE.MeshBasicMaterial({
      color: 0x7d2534
    });

    // Register the mesh.
    var mesh = new THREE.Mesh(geometry, material);
    this.world.add(mesh);

    // Position the point.
    mesh.position.set(x, y, z);

  },


  /**
   * Render the scene.
   */
  render: function() {

    // TODO|dev: Spin sphere.
    this.world.rotation.y += 0.003;

    // Render the new frame.
    window.requestAnimationFrame(this.render.bind(this));
    this.renderer.render(this.scene, this.camera);

  },


});
