

import _ from 'lodash';
import $ from 'jquery';
import Hammer from 'hammerjs';
import Backbone from 'backbone';
import THREE from 'three';

import View from '../lib/view';
import borders from '../data/world.geo.json';
import * as utils from '../utils';
import * as opts from '../opts.yml';


export default View.extend({


  el: '#globe',


  channels: ['globe'],


  /**
   * Start the globe.
   */
  initialize: function() {

    this._initScene();
    this._initCamera();
    this._initSphere();
    this._initCountries();
    this._initHeading();
    this._initLocation();
    this._initZoom();

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

    // Top-level mesh group.
    this.world = new THREE.Object3D();
    this.scene.add(this.world);

  },


  /**
   * Create the camera, bind resize.
   */
  _initCamera: function() {

    let w = this.$el.width();
    let h = this.$el.height();

    // Create the camera.
    this.camera = new THREE.PerspectiveCamera(
      opts.camera.fov,
      w / h,
      opts.camera.near,
      opts.camera.far
    );

    this.fitCamera()

    // Re-fit on resize.
    let resize = _.debounce(this.fitCamera.bind(this), 500);
    $(window).resize(resize);

  },


  /**
   * Create a sphere for the earth.
   */
  _initSphere: function() {

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
   * Draw country borders.
   */
  _initCountries: function() {
    this.drawGeoJSON(borders);
  },


  /**
   * Geolocate the camera.
   */
  _initLocation: function() {

    // Get client position.
    window.navigator.geolocation.getCurrentPosition(pos => {

      // Convert lon/lat -> XYZ.
      let [x, y, z] = utils.lonLatToXYZ(
        pos.coords.longitude,
        pos.coords.latitude
      );

      // Position the camera, point at origin.
      this.camera.position.set(x, y, z);
      this.camera.lookAt(new THREE.Vector3(0, 0, 0));

      // Store the default heading.
      this.eye = this.camera.matrix.clone();

      // TODO: More direct way to do this?
      this.eye.lookAt(
        new THREE.Vector3(x, y, z),
        new THREE.Vector3(0, 0.001, 0),
        new THREE.Vector3(x, y, z).normalize()
      );

    });

  },


  /**
   * Listen for device movement.
   */
  _initHeading: function() {

    // Bind to `deviceorientation`.
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', data => {
        this.orientation = data;
      });
    }

    else {
      // TODO: Flash error.
    }

  },


  /**
   * Listen for pinch zooming.
   */
  _initZoom: function() {
    let gesture = new Hammer(this.el);
    // TODO
  },


  /**
   * Fit the camera to the container.
   */
  fitCamera: function() {

    let w = this.$el.width();
    let h = this.$el.height();

    // Set aspect ratio.
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();

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
   * Point the camera.
   */
  point: function() {

    if (!this.orientation || !this.eye) return;

    let a = THREE.Math.degToRad(this.orientation.alpha);
    let b = THREE.Math.degToRad(this.orientation.beta);
    let g = THREE.Math.degToRad(this.orientation.gamma);

    let ra = new THREE.Matrix4();
    let rb = new THREE.Matrix4();
    let rg = new THREE.Matrix4();

    ra.makeRotationZ(a);
    rb.makeRotationX(b);
    rg.makeRotationY(g);

    let r = this.eye.clone();
    r.multiply(ra);
    r.multiply(rb);
    r.multiply(rg);

    this.camera.quaternion.setFromRotationMatrix(r);

  },


  /**
   * Trace the heading vector.
   */
  trace: function() {

    // Get the heading vector.
    let heading = new THREE.Vector3(0, 0, -1);
    heading.applyQuaternion(this.camera.quaternion);

    // Get the scaling coefficient.
    let a = heading.dot(heading);
    let b = 2 * heading.dot(this.camera.position);
    let u = (-2*b) / (2*a);

    let distance = Infinity;

    // If we're not looking out into space.
    if (u > 0) {

      // Get far-side intersection.
      let delta = heading.clone().multiplyScalar(u);
      let point = this.camera.position.clone().add(delta);

      // Get distance to the point.
      distance = this.camera.position.distanceTo(point);

    }

    // Publish the trace.
    this.channels.globe.trigger('trace', {
      distance: distance
    });

  },


  /**
   * Render the scene.
   */
  render: function() {

    this.point();
    this.trace();

    // Render the new frame.
    window.requestAnimationFrame(this.render.bind(this));
    this.renderer.render(this.scene, this.camera);

  },


});
