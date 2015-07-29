

module.exports = {

  options: {
    watch: true,
    transform: ['babelify'],
    browserifyOptions: {
      debug: true
    }
  },

  dist: {
    src: 'src/javascripts/index.js',
    dest: '<%= site %>/script.js'
  }

};
