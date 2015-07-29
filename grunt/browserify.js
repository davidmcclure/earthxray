

module.exports = {

  options: {
    watch: true,
    transform: ['babelify', 'yamlify'],
    browserifyOptions: {
      debug: true
    }
  },

  dist: {
    src: 'src/javascripts/index.js',
    dest: '<%= site %>/script.js'
  }

};
