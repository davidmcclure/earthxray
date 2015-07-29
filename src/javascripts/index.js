

import $ from 'jquery';
import Globe from './views/globe';


let globe = new Globe();


// TODO|dev
$.getJSON('data/world.geo.json', (world) => {
  globe.drawGeoJSON(world);
});
