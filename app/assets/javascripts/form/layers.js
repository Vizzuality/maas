var config = {
  username: "maas"
};

statements       = createCalls(8, 3);

var layersURL = {
  base:    'http://{s}.tiles.mapbox.com/v3/cartodb.map-1nh578vv/{z}/{x}/{y}.png',
  base2:   'http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png',
  terrain: 'http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png',
  forest:  'http://{s}.tiles.mapbox.com/v3/cartodb.map-l2hg5qge/{z}/{x}/{y}.png',
  density: 'https://examples.cartodb.com/tiles/points_na/{z}/{x}/{y}.png?' + statements[0]
};

var baseLayers = {
  base:     { url: layersURL.base,    coords: { zoom: 5,  center: [40.34, 14.06] }},
  hexagons: { url: layersURL.base,    coords: { zoom: 3,  center: [30.00, -99.00] }},
  terrain:  { url: layersURL.terrain, coords: { zoom: 5,  center: [33.13, -3.71] }},
  polygons: { url: layersURL.base,    coords: { zoom: 7,  center: [-7.36, 34.88] }},
  forest:   { url: layersURL.forest,  coords: { zoom: 9,  center: [40.25, -5.92] }},
  density:  { url: layersURL.density, coords: { zoom: 3,  center: [43.00, -101.25] }},
  thematic: { url: layersURL.base,    coords: { zoom: 3,  center: [43.06, 29.35] }}
}

var cHexagons = {
  user_name: "saleiva",
  table_name: "github_javascript",
  style: styles.density.hexagons,
  query:"WITH hgrid AS (SELECT CDB_HexagonGrid(ST_Expand(CDB_XYZ_Extent({x},{y},{z}),CDB_XYZ_Resolution({z}) * 15),CDB_XYZ_Resolution({z}) * 15) as cell) SELECT hgrid.cell as the_geom_webmercator, count(i.cartodb_id) as prop_count FROM hgrid, github_javascript i WHERE ST_Intersects(i.the_geom_webmercator, hgrid.cell) GROUP BY hgrid.cell"
};


var cDensity = {
  user_name: 'examples',
  table_name: 'maas_markers',
  query: 'SELECT cartodb_id, the_geom_webmercator, ST_AsGeoJSON(the_geom) AS latlng FROM {{table_name}}',
  interactivity: "cartodb_id, latlng",
  auto_bound: false,
  featureOver:  function() { document.body.style.cursor = "pointer"; },
  featureOut:   function() { document.body.style.cursor = "default"; },
  featureClick: function(ev, latlng, pos, data) {

    var // get coordinates of the marker
    parsedData = JSON.parse(data.latlng),
    latlng     = new L.LatLng(parsedData.coordinates[1], parsedData.coordinates[0]);

    infowindow.model.set({ template_name: 'templates/map/infowindow/infowindow_classic', offset: [50, 10], content: data, latlng: [latlng.lat, latlng.lng] });
    infowindow.showInfowindow();
  }
};

var cPolygonsClassicInfowindow = function(ev, latlng, pos, data) {

  infowindow.model.set({
    template_name: 'templates/map/infowindow/infowindow_classic',
    title: data.name,
    offset: [108, -10],
    description: data.description,
    latlng: [latlng.lat, latlng.lng],
    subtitle: data.iucn_cat,
    description: data.gov_type
  });

  infowindow.showInfowindow();
};

var cPolygonsNewInfowindow = function(ev, latlng, pos, data) {

  infowindow.model.set({
    template_name: 'templates/map/infowindow/infowindow_big',
    title: data.name,
    offset: [108, -10],
    description: data.description,
    latlng: [latlng.lat, latlng.lng],
    subtitle: data.iucn_cat,
    description: data.gov_type
  });

  infowindow.showInfowindow();
  };

var cNewInfowindow = function(ev, latlng, pos, data) {

  var // get coordinates of the marker
  parsedData = JSON.parse(data.latlng),
  latlng     = new L.LatLng(parsedData.coordinates[1], parsedData.coordinates[0]);

  infowindow.model.set({
    template_name: 'templates/map/infowindow/infowindow_big',
    title: data.title,
    src: data.src,
    offset: [108, -10],
    subtitle: data.subtitle,
    description: data.description,
    cartodb_id: data.cartodb_id,
    latlng: [latlng.lat, latlng.lng],
    subtitle: data.subtitle,
    description: data.description,
  });

  infowindow.showInfowindow();
};

var cMarkersNewInfowindow = function(ev, latlng, pos, data) {

  var // get coordinates of the marker
  parsedData = JSON.parse(data.latlng),
  latlng     = new L.LatLng(parsedData.coordinates[1], parsedData.coordinates[0]);

  infowindow.model.set({
    template_name: 'templates/map/infowindow/infowindow_photo',
    title: data.title,
    src: data.src,
    offset: [108, -10],
    subtitle: data.subtitle,
    description: data.description,
    cartodb_id: data.cartodb_id,
    latlng: [latlng.lat, latlng.lng],
    subtitle: data.subtitle,
    description: data.description,
  });

  infowindow.showInfowindow();
};

var cMarkersClassicInfowindow = function(ev, latlng, pos, data) {

  var // get coordinates of the marker
  parsedData = JSON.parse(data.latlng),
  latlng     = new L.LatLng(parsedData.coordinates[1], parsedData.coordinates[0]);

  infowindow.model.set({
    template_name: 'templates/map/infowindow/infowindow_classic',
    title: data.title,
    cartodb_id: data.cartodb_id,
    src: data.src,
    offset: [50, 10],
    subtitle: data.subtitle,
    description: data.description,
    latlng: [latlng.lat, latlng.lng]
  });

  infowindow.showInfowindow();
};

var cMarkers = {
  user_name: config.username,
  table_name: 'markers',
  query: 'SELECT cartodb_id, the_geom_webmercator, ST_AsGeoJSON(the_geom) AS latlng, src, title, subtitle, description, category FROM {{table_name}}',
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
  query: 'SELECT cartodb_id, pop_est, gdp_md_est, the_geom_webmercator FROM {{table_name}}',
  interactivity: "cartodb_id, pop_est, gdp_md_est",
  featureOver:  function() { document.body.style.cursor = "pointer"; },
  featureOut:   function() { document.body.style.cursor = "default"; },
  featureClick: function(ev, latlng, pos, data) {

    infowindow.model.set({
      template_name: 'templates/map/infowindow/infowindow_big',
      title: data.cartodb_id,
      offset: [108, 0],
      subtitle: "Subtitle",
      description: "Description",
      latlng: [latlng.lat, latlng.lng]
    });

    infowindow.showInfowindow();

  }

};

var cPolygons = {
  user_name: config.username,
  table_name: 'polygons',
  query: 'SELECT cartodb_id, iucn_cat, gov_type, name, the_geom_webmercator FROM {{table_name}}',
  interactivity: "cartodb_id, iucn_cat, gov_type, name",
  tile_style: styles.polygons.base,
  featureOver:  function() { document.body.style.cursor = "pointer"; },
  featureOut:   function() { document.body.style.cursor = "default"; },
  featureClick: function(ev, latlng, pos, data) {

    infowindow.model.set({
      template_name: 'templates/map/infowindow/infowindow_classic',
      cartodb_id: data.cartodb_id,
      offset: [50, 0],
      latlng: [latlng.lat, latlng.lng],
      title: data.name,
      description: data.description,
      subtitle: data.iucn_cat,
      description: data.gov_type
    });

    infowindow.showInfowindow();

  }
};

var layers = { // This hash contains the combination of layers for each of the options in the navigation
  markers:     { url: "worldheritagesites.org", coords: baseLayers.base.coords,     cdb: cMarkers,  base: baseLayers.base,     extra: null },
  polygons:    { url: "tanzania.gov.tz", coords: baseLayers.polygons.coords, cdb: cPolygons, base: baseLayers.polygons, extra: null },
  rectangular: { url: "map.javascript-developers.info", coords: baseLayers.density.coords,  cdb: null,      base: baseLayers.density,  extra: baseLayers.base },
  density:     { url: "map.javascript-developers.info", coords: baseLayers.hexagons.coords, cdb: cHexagons, base: baseLayers.hexagons, extra: null },
  thematic:    { url: "world-population-watch.co.uk", coords: baseLayers.thematic.coords, cdb: cThematic, base: baseLayers.thematic, extra: null },
  dont_know:   { url: null, coords: baseLayers.base.coords,     cdb: null,      base: null,                extra: null }
};
