

export default {

  options: {

    transform: [
      'babelify',
      'yamlify',
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
