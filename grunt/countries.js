

import _ from 'lodash';
import * as utils from '../src/javascripts/utils'


export default (grunt) => {

  grunt.registerTask(
    'countries-data',
    'Filter country labels GeoJSON',
    () => {

      let labels = [];

      // Load OSM JSON.
      let json = grunt.file.readJSON('data/labels.geo.json');

      // Walk countries.
      for (let c of json.features) {

        let name = c.properties['name:en'];

        // lon/lat -> XYZ.
        let [x, y, z] = utils.lonLatToXYZ(
          c.geometry.coordinates[0],
          c.geometry.coordinates[1]
        );

        if (name) {
          labels.push({
            name: name,
            x: x,
            y: y,
            z: z,
          });
        }

      }

      grunt.file.write(
        'src/javascripts/data/labels.json',
        JSON.stringify(labels, null, 2)
      );

    }
  );

  grunt.registerTask(
    'countries-sprite',
    'Render country labels sprite sheet',
    () => {

      console.log('sprite');

    }
  );

};
