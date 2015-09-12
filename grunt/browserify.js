

export default {

  options: {

    transform: [

      ['babelify', {
        optional: ['es7.classProperties']
      }],

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
