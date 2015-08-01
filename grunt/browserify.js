

export default {

  options: {

    transform: [
      'babelify',
      'browserify-shim',
      'yamlify'
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
