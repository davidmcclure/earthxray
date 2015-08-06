

import _ from 'lodash';
import $ from 'jquery';
import Backbone from 'backbone';
import THREE from 'three';

import * as opts from '../opts.yml';
import * as utils from '../utils';


export default Backbone.View.extend({


  el: '#globe',


  /**
   * Start the globe.
   */
  initialize: function() {

    this._initScene();
    this._initResize();
    this._initSphere();
    this._initCamera();

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
    let resize = _.debounce(this.fitWindow.bind(this), 500);

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
    let geometry = new THREE.SphereGeometry(
      opts.earth.radius,
      opts.sphere.segments,
      opts.sphere.segments
    );

    // Create wireframe material.
    let material = new THREE.MeshBasicMaterial({
      color: opts.sphere.lineColor,
      wireframeLinewidth: opts.sphere.lineWidth,
      wireframe: true,
    });

    // Register the mesh.
    this.sphere = new THREE.Mesh(geometry, material);
    this.world.add(this.sphere);

  },


  /**
   * Place the camera.
   */
  _initCamera: function() {

    // Geolocate to the client's position.
    window.navigator.geolocation.getCurrentPosition(pos => {

      // Get camera location.
      let [x, y, z] = utils.lonLatToXYZ(
        pos.coords.longitude,
        pos.coords.latitude
      );

      this.camera.position.set(x, y, z);
      this.camera.lookAt(new THREE.Vector3(0, 0, 0));

    });

    // Listen for orientation.
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', data => {
        this.orientation = data;
      });
    }

  },


  /**
   * Fit the scene to the container.
   */
  fitWindow: function() {

    // Measure container.
    let w = this.$el.width();
    let h = this.$el.height();

    // Create the camera.
    this.camera = new THREE.PerspectiveCamera(
      opts.camera.fov,
      w / h,
      opts.camera.near,
      opts.camera.far
    );

    // Size the renderer.
    this.renderer.setSize(w, h);

  },


  /**
   * Draw a GeoJSON geometry.
   *
   * @param {Object} json
   */
  drawGeoJSON: function(json) {

    // Walk features.
    for (let {
      geometry: {
        coordinates: coords,
        type: type,
      }
    } of json.features) {
      switch (type) {

        case 'Polygon':
          this.drawPolygon(coords[0]);
        break;

        case 'MultiPolygon':
          for (let [polygon] of coords) {
            this.drawPolygon(polygon);
          }
        break;

      }
    }

  },


  /**
   * Draw a GeoJSON polygon.
   *
   * @param {Array} points
   */
  drawPolygon: function(points) {

    // Create line material.
    let material = new THREE.LineBasicMaterial({
      color: opts.borders.lineColor,
    });

    let geometry = new THREE.Geometry();

    // Convert lon/lat -> XYZ, add to line.
    for (let [lon, lat] of points) {
      let [x, y, z] = utils.lonLatToXYZ(lon, lat);
      geometry.vertices.push(new THREE.Vector3(x, y, z));
    }

    // Register the line.
    let line = new THREE.Line(geometry, material);
    this.world.add(line);

  },


  /**
   * Render the scene.
   */
  render: function() {

    // Render the new frame.
    window.requestAnimationFrame(this.render.bind(this));
    this.renderer.render(this.scene, this.camera);

  },


});
