var config = {
  username: "maas"
};

var layersURL = {
  base:     'http://{s}.tiles.mapbox.com/v3/cartodb.map-1nh578vv/{z}/{x}/{y}.png',
  terrain:  'http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png',
  forest:   'http://{s}.tiles.mapbox.com/v3/cartodb.map-l2hg5qge/{z}/{x}/{y}.png'
};

var baseLayers = {
  base:     { url: layersURL.base,    coords: { zoom: 5, center: [40.34, 14.06]   }},
  hexagons: { url: layersURL.base,    coords: { zoom: 4, center: [30.00, -99.00]  }},
  terrain:  { url: layersURL.terrain, coords: { zoom: 5, center: [33.13, -3.71]   }},
  polygons: { url: layersURL.base,    coords: { zoom: 8, center: [48.20, -121.46] }},
  forest:   { url: layersURL.forest,  coords: { zoom: 9, center: [40.25, -5.92]   }},
  density:  { url: layersURL.base,    coords: { zoom: 4, center: [30.00, -99.00]  }},
  thematic: { url: layersURL.base,    coords: { zoom: 3, center: [43.06, 29.35]   }}
};

var queries = {
  markers:    'SELECT cartodb_id, the_geom_webmercator, ST_AsGeoJSON(the_geom) AS latlng, src, title, subtitle, description, category FROM {{table_name}}',
  thematic:   'SELECT cartodb_id, admin, pop_est, gdp_md_est, the_geom_webmercator FROM {{table_name}}',
  density:    'SELECT cartodb_id, the_geom_webmercator, ST_AsGeoJSON(the_geom) AS latlng FROM {{table_name}}',
  polygons:   'SELECT cartodb_id, desig, desig_type, iucn_cat, name, the_geom_webmercator FROM {{table_name}}',
  hexagons:   "WITH hgrid AS (SELECT CDB_HexagonGrid(ST_Expand(CDB_XYZ_Extent({x},{y},{z}), CDB_XYZ_Resolution({z}) * 15), CDB_XYZ_Resolution({z}) * 15) as cell) SELECT hgrid.cell as the_geom_webmercator, count(i.cartodb_id) as prop_count FROM hgrid, github_developers i WHERE language = 'javascript' AND ST_Intersects(i.the_geom_webmercator, hgrid.cell) GROUP BY hgrid.cell",
  rectangles: "WITH hgrid AS (SELECT CDB_RectangleGrid(ST_Expand(CDB_XYZ_Extent({x},{y},{z}),CDB_XYZ_Resolution({z}) * 15),CDB_XYZ_Resolution({z}) * 15, CDB_XYZ_Resolution({z}) * 15) AS cell) SELECT hgrid.cell AS the_geom_webmercator, count(i.cartodb_id) AS prop_count FROM hgrid, github_developers i WHERE language = 'javascript' AND ST_Intersects(i.the_geom_webmercator, hgrid.cell) GROUP BY hgrid.cell"
};

var infowindows = {
  big:      { template_name: 'templates/map/infowindow/infowindow_big',      offset: [108, -10] },
  thematic: { template_name: 'templates/map/infowindow/infowindow_thematic', offset: [108, -10] },
  polygons: { template_name: 'templates/map/infowindow/infowindow_polygons', offset: [108, -10] },
  small:    { template_name: 'templates/map/infowindow/infowindow_small',    offset: [108, -10] },
  photo:    { template_name: 'templates/map/infowindow/infowindow_photo',    offset: [108, -10] },
  classic:  { template_name: 'templates/map/infowindow/infowindow_classic',  offset: [50, 10], content: null }
};

var cHexagons = {
  user_name: config.username,
  table_name: "github_developers",
  style: styles.density.hexagons,
  query: queries.hexagons
};

var cDensity = {
  user_name: config.username,
  table_name: "github_developers",
  style: styles.density.hexagons,
  query: queries.rectangles
};

var cThematicNewInfowindow = function(ev, latlng, pos, data) {

  var value, legend;

  if (thematicValue == "population") {
    value =  data.pop_est;
    legend = "population";
  } else {
    value =  data.gdp_md_est;
    legend = "gdp";
  }

  infowindow.model.set({
    template_name: infowindows.small.template_name,
    offset: infowindows.small.offset,
    latlng: [latlng.lat, latlng.lng],
    title: data.admin,
    gdp: data.gdp_md_est,
    population: data.pop_est,
    value: value,
    legend: legend
  });

  infowindow.showInfowindow();
};

var cThematicClassicInfowindow = function(ev, latlng, pos, data) {

  var value, legend;

  if (thematicValue == "population") {
    value =  data.pop_est;
    legend = "population";
  } else {
    value =  data.gdp_md_est;
    legend = "gdp";
  }

  infowindow.model.set({
    template_name: infowindows.classic.template_name,
    offset: infowindows.classic.offset,
    latlng: [latlng.lat, latlng.lng],
    content: [{key: "pop_est", value: data.pop_est }, { key: "gdp_md_est", value: data.gdp_md_est }],
    cartodb_id: data.cartodb_id,
    title: data.admin,
    gdp: data.gdp_md_est,
    population: data.pop_est,
    value: data.pop_est,
    legend: legend
  });

  infowindow.showInfowindow();
};

var cPolygonsClassicInfowindow = function(ev, latlng, pos, data) {

  infowindow.model.set({
    template_name: infowindows.classic.template_name,
    offset: infowindows.classic.offset,
    cartodb_id: data.cartodb_id,
    content: [{key: "name", value: data.name }, {key: "iucn_cat", value: data.iucn_cat}],
    latlng: [latlng.lat, latlng.lng],
    name: data.name,
    iucn_cat: data.iucn_cat,
    status: data.status,
    desig: data.desig,
    desig_type: data.desig_type,
    iucn_cat: data.iucn_cat
  });

  infowindow.showInfowindow();
};

var cPolygonsNewInfowindow = function(ev, latlng, pos, data) {

  infowindow.model.set({
    template_name: infowindows.polygons.template_name,
    offset: infowindows.big.offset,
    latlng: [latlng.lat, latlng.lng],
    cartodb_id: data.cartodb_id,
    name: data.name,
    iucn_cat: data.iucn_cat,
    status: data.status,
    desig: data.desig,
    desig_type: data.desig_type,
    iucn_cat: data.iucn_cat
  });

  infowindow.showInfowindow();
};

var cNewInfowindow = function(ev, latlng, pos, data) {

  var // get coordinates of the marker
  parsedData = JSON.parse(data.latlng),
  latlng     = new L.LatLng(parsedData.coordinates[1], parsedData.coordinates[0]);

  infowindow.model.set({
    template_name: infowindows.big.template_name,
    offset: infowindows.big.offset,
    title: data.title,
    src: data.src,
    subtitle: data.subtitle,
    description: data.description,
    cartodb_id: data.cartodb_id,
    latlng: [latlng.lat, latlng.lng],
    subtitle: data.subtitle,
    description: data.description
  });

  infowindow.showInfowindow();
};

var cMarkersNewInfowindow = function(ev, latlng, pos, data) {

  var // get coordinates of the marker
  parsedData = JSON.parse(data.latlng),
  latlng     = new L.LatLng(parsedData.coordinates[1], parsedData.coordinates[0]);

  infowindow.model.set({
    template_name: infowindows.photo.template_name,
    offset: infowindows.photo.offset,
    title: data.title,
    src: data.src,
    subtitle: data.subtitle,
    description: data.description,
    cartodb_id: data.cartodb_id,
    latlng: [latlng.lat, latlng.lng],
    subtitle: data.subtitle,
    description: data.description,
    content: [{key: "title", value: data.title }, {key: "subtitle", value: data.subtitle }]
  });

  infowindow.showInfowindow();
};

var cMarkersClassicInfowindow = function(ev, latlng, pos, data) {

  var // get coordinates of the marker
  parsedData = JSON.parse(data.latlng),
  latlng     = new L.LatLng(parsedData.coordinates[1], parsedData.coordinates[0]);

  infowindow.model.set({
    template_name: infowindows.classic.template_name,
    offset: infowindows.classic.offset,
    title: data.title,
    cartodb_id: data.cartodb_id,
    src: data.src,
    subtitle: data.subtitle,
    description: data.description,
    latlng: [latlng.lat, latlng.lng],
    content: [{key: "title", value: data.title }, {key: "country", value: data.subtitle }]
  });

  infowindow.showInfowindow();
};

var cMarkers = {
  user_name: config.username,
  table_name: 'markers',
  query: queries.markers,
  tile_style: styles.markers.base,
  interactivity: "cartodb_id, latlng, src, title, subtitle, description, category",
  auto_bound: false,
  featureOver:  function() { document.body.style.cursor = "pointer"; },
  featureOut:   function() { document.body.style.cursor = "default"; },
  featureClick: cMarkersClassicInfowindow
};

var cThematic = {
  user_name: config.username,
  table_name: 'choropleth',
  query: queries.thematic,
  tile_style: styles.thematic.choropleth.population,
  interactivity: "cartodb_id, admin, pop_est, gdp_md_est",
  featureOver:  function() { document.body.style.cursor = "pointer"; },
  featureOut:   function() { document.body.style.cursor = "default"; },
  featureClick: cThematicClassicInfowindow
};

var cPolygons = {
  user_name: config.username,
  table_name: 'polygons',
  query: queries.polygons,
  interactivity: "cartodb_id, name, desig, desig_type, iucn_cat",
  tile_style: styles.polygons.base,
  featureOver:  function() { document.body.style.cursor = "pointer"; },
  featureOut:   function() { document.body.style.cursor = "default"; },
  featureClick: cPolygonsClassicInfowindow
};

var layers = { // This hash contains the combination of layers for each of the options in the navigation
  markers:     { url: "worldheritagesites.org",         coords: baseLayers.base.coords,     cdb: cMarkers,  base: baseLayers.base,     extra: null },
  polygons:    { url: "protected-areas.gov",            coords: baseLayers.polygons.coords, cdb: cPolygons, base: baseLayers.polygons, extra: null },
  rectangular: { url: "map.javascript-developers.info", coords: baseLayers.density.coords,  cdb: cDensity,  base: baseLayers.density,  extra: null },
  density:     { url: "map.javascript-developers.info", coords: baseLayers.hexagons.coords, cdb: cHexagons, base: baseLayers.hexagons, extra: null },
  thematic:    { url: "world-population-watch.co.uk",   coords: baseLayers.thematic.coords, cdb: cThematic, base: baseLayers.thematic, extra: null },
  dont_know:   { url: null,                             coords: baseLayers.base.coords,     cdb: null,      base: null,                extra: null }
};
