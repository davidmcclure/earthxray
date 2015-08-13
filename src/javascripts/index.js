

import $ from 'jquery';
import Globe from './views/globe';
import world from './data/world.geo.json';


let globe = new Globe();


// TODO|dev
globe.drawGeoJSON(world);
