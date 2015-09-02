

import _ from 'lodash';
import $ from 'jquery';
import Hammer from 'hammerjs';
import Backbone from 'backbone';
import THREE from 'three';
import Promise from 'bluebird';

import View from '../lib/view';
import countries from '../data/countries';
import * as utils from '../utils';
import * as opts from '../opts.yml';

// Register the typeface.
import helvetiker from 'three.regular.helvetiker';
THREE.typeface_js.loadFace(helvetiker);


export default View.extend({


  el: '#globe',


  channels: ['globe'],


  /**
   * Render the scene, then sync the camera.
   */
  initialize: function() {

    this.channels.globe.trigger('loadstart');

    Promise.all([

      this._createScene(),
      this._createCamera(),
      this._drawSphere(),
      this._drawGeography(),
      this._geolocate(),

    ]).then(() => {

      this._applyLocation();
      this._listenForOrientation();
      this._listenForZoom();

      this.channels.globe.trigger('loadend');

    });

    this.render();

  },


  /**
   * Create the scene and renderer.
   */
  _createScene: function() {

    this.scene = new THREE.Scene();

    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });

    // Inject the WebGL container.
    this.$el.append(this.renderer.domElement);

    // Add a top-level mesh group.
    this.world = new THREE.Object3D();
    this.scene.add(this.world);

  },


  /**
   * Create the camera, bind resize.
   */
  _createCamera: function() {

    this.camera = new THREE.PerspectiveCamera(
      opts.camera.fov,
      1,
      opts.camera.near,
      opts.camera.far
    );

    this.fitCamera()

    // Re-fit on resize.
    let resize = _.debounce(this.fitCamera.bind(this), 500);
    $(window).resize(resize);

    // Default position.
    this.camera.position.z = opts.camera.startz;

  },


  /**
   * Create a sphere for the earth.
   */
  _drawSphere: function() {

    let geometry = new THREE.SphereGeometry(
      opts.earth.radius,
      opts.sphere.segments,
      opts.sphere.segments
    );

    let material = new THREE.MeshBasicMaterial({
      color: opts.sphere.lineColor,
      wireframeLinewidth: opts.sphere.lineWidth,
      wireframe: true,
    });

    this.sphere = new THREE.Mesh(geometry, material);
    this.world.add(this.sphere);

  },


  /**
   * Draw country borders / labels (non-blocking).
   *
   * @param {Function} done
   */
  _drawGeography: function(done) {

    let deferred = Promise.pending();
    let texts = new THREE.Geometry();

    let i = 0;
    for (let c of countries) {
      setTimeout(() => {

        // Draw the borders.
        for (let p of c.points) {
          this.drawBorder(p);
        }

        // Create the label.
        if (c.anchor) {

          let geometry = new THREE.TextGeometry(c.name, {
            curveSegments: 1,
            size: 30,
            font: 'helvetiker',
            height: 0,
          });

          geometry.center();

          let mesh = new THREE.Mesh(geometry);

          mesh.position.set(
            c.anchor[0],
            c.anchor[1],
            c.anchor[2]
          );

          mesh.lookAt(new THREE.Vector3(0, 0, 0));
          mesh.updateMatrix();
          texts.merge(geometry, mesh.matrix);

        }

        // Render the labels.
        if (++i == countries.length) {

          let material = new THREE.MeshBasicMaterial({
            color: 0x000000
          });

          let mesh = new THREE.Mesh(texts, material);
          this.world.add(mesh);

          deferred.resolve();

        }

      }, 0);
    }

    return deferred.promise;

  },


  /**
   * Geolocate the client.
   */
  _geolocate: function() {

    let deferred = Promise.pending();

    window.navigator.geolocation.getCurrentPosition(pos => {
      this.location = pos;
      deferred.resolve();
    }, err => {
      // TODO: Flash error.
    });

    return deferred.promise;

  },


  /**
   * Sync camera with location.
   */
  _applyLocation: function() {

    // Convert lon/lat -> XYZ.
    let [x, y, z] = utils.lonLatToXYZ(
      this.location.coords.longitude,
      this.location.coords.latitude
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

  },


  /**
   * Listen for device movement.
   */
  _listenForOrientation: function() {

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
  _listenForZoom: function() {

    // Enable pinch.
    let gesture = new Hammer(this.el);
    gesture.get('pinch').set({ enable: true });

    let minFov = opts.camera.minFov;
    let maxFov = opts.camera.maxFov;
    let _fov;

    // Capture initial FOV.
    gesture.on('pinchstart', e => {
      _fov = this.camera.fov;
    });

    gesture.on('pinch', e => {

      let fov = _fov / e.scale;

      // Break if we're out of bounds.
      if (fov < minFov || fov > maxFov) return;

      // Zoom the camera.
      this.camera.fov = fov;
      this.camera.updateProjectionMatrix();

    });

  },


  /**
   * Fit the camera to the container.
   */
  fitCamera: function() {

    this.w = this.$el.width();
    this.h = this.$el.height();

    // Set aspect ratio.
    this.camera.aspect = this.w / this.h;
    this.camera.updateProjectionMatrix();

    // Size the renderer.
    this.renderer.setSize(this.w, this.h);

  },


  /**
   * Draw a boundary line.
   *
   * @param {Array} points
   */
  drawBorder: function(points) {

    let material = new THREE.LineBasicMaterial({
      color: opts.borders.lineColor,
      linewidth: opts.borders.lineWidth,
    });

    let geometry = new THREE.Geometry();

    // Register the vertices.
    for (let [x, y, z] of points) {
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
      distance: distance,
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
