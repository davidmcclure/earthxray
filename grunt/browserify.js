

export default {

  options: {

    transform: [
      'babelify',
      'browserify-shader',
      'yamlify',
      'reactify',
    ],

    watch: true,
    browserifyOptions: {
      debug: true
    }

  },

  dist: {
    src: 'src/javascripts/index.js',
    dest: '<%= site %>/script.js'
  }

};
