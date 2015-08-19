

import _ from 'lodash';


export default (grunt) => {

  grunt.registerTask(
    'labels',
    'Filter country labels GeoJSON',
    () => {

      // Load the Overpass JSON.
      let json = grunt.file.readJSON('data/labels.geo.json');

      // Delete all props except for the name.
      for (let { properties: props } of json.features) {
        for (let k of _.keys(props)) {
          if (k != 'name:en') {
            delete props[k];
          }
        }
      }

      grunt.file.write(
        'src/javascripts/data/labels.geo.json',
        JSON.stringify(json)
      );

    }
  );

};
