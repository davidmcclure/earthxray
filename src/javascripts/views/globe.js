

import _ from 'lodash';
import $ from 'jquery';
import Backbone from 'backbone';
import THREE from 'three';
import * as opts from './globe.yml';
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
    var geometry = new THREE.SphereGeometry(
      opts.sphere.radius,
      opts.sphere.segments,
      opts.sphere.segments
    );

    // Create wireframe material.
    var material = new THREE.MeshBasicMaterial({
      color: opts.sphere.lineColor,
      wireframeLinewidth: opts.sphere.lineWidth,
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
    this.camera = new THREE.PerspectiveCamera(
      opts.camera.fov,
      w / h,
      opts.camera.near,
      opts.camera.far,
    );

    // Size the renderer.
    this.renderer.setSize(w, h);

    // TODO|dev: Position.
    this.camera.position.z = 2;

  },


  /**
   * Draw a GeoJSON geometry.
   *
   * @param {Object} json
   */
  drawGeoJSON: function(json) {

    // Walk features.
    for (var {
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
          for (var [polygon] of coords) {
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
    var material = new THREE.LineBasicMaterial({
      color: opts.borders.lineColor,
    });

    var geometry = new THREE.Geometry();

    // Add points to line.
    for (var [lon, lat] of points) {
      var [x, y, z] = utils.lonLatToXYZ(lon, lat);
      geometry.vertices.push(new THREE.Vector3(x, y, z));
    }

    // Register the line.
    var line = new THREE.Line(geometry, material);
    this.world.add(line);

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
