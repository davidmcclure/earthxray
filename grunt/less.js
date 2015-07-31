

export default {

  options: {
    paths: 'node_modules',
    sourceMap: true,
    sourceMapFilename: '<%= site %>/style.map',
    sourceMapURL: 'style.map',
  },

  dist: {
    src: 'src/stylesheets/index.less',
    dest: '<%= site %>/style.css'
  }

};
