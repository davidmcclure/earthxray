

import Globe from './controllers/globe';
import Distance from './controllers/distance';
import Center from './controllers/center';


// TODO|dev
require('viewport-units-buggyfill').init();


new Globe();
new Distance();
new Center();
