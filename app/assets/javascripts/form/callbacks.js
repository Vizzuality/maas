var callbacks = {};

callbacks.checkbox = {};
callbacks.radio    = {};

callbacks.checkbox.markers = {

  dynamic_filters: {
    on:  function() {

      selector.collection = new cdb.geo.ui.SelectorItems([
        { name: "All" ,     callback: null },
        { name: "Natural",  callback: null },
        { name: "Cultural", callback: null }
      ]);

      mapView.$el.parent().append(selector.render().$el);
      selector.show();

      $(".dk").dropkick({
        change: function (value, label) {

          var query;

          if (value == "All") {
            query = 'SELECT cartodb_id, the_geom_webmercator, ST_AsGeoJSON(the_geom) AS latlng, src, title, subtitle, description, category FROM {{table_name}}';
          } else if (value == "Natural") {
            query = "SELECT cartodb_id, the_geom_webmercator, ST_AsGeoJSON(the_geom) AS latlng, src, title, subtitle, description, category FROM {{table_name}} WHERE category = 'natural'";
          } else if (value == "Cultural") {
            query = "SELECT cartodb_id, the_geom_webmercator, ST_AsGeoJSON(the_geom) AS latlng, src, title, subtitle, description, category FROM {{table_name}} WHERE category = 'cultural'";
          }

          infowindow.hide(true);
          window.navigation.getCartoDBLayer().set("query", query);
        }
      });

    },
    off: function() {
      selector.hide();
    }
  },

  custom_infowindows: {

    on: function() {
      if (!infowindow.isHidden()) var show = true;
      infowindow.hide(true);

      var currentLayer = window.navigation.getCurrentCartoDBLayerOptions();

      cMarkers.featureClick       = cMarkersNewInfowindow;
      currentLayer.featureClick   = cMarkersNewInfowindow;

      window.navigation.replaceCartoDBLayer(currentLayer);

      if (show) {
        infowindow.model.set(newInfowindow);
        infowindow.show();
      }

      // switcher.collection = new cdb.geo.ui.SwitcherItems([
      //   { selected: true,  name: "Map",       callback: function() {
      //     window.navigation.replaceBaseLayer(lBase);
      //   } },
      //   { selected: false, name: "Satellite", callback: function() {
      //     window.navigation.replaceBaseLayer(lForest);
      //   } }
      // ]);

      // mapView.$el.parent().append(switcher.render().$el);

      // switcher.show();
    },

    off: function() {
      if (!infowindow.isHidden()) var show = true;
      infowindow.hide(true);
      var currentLayer = window.navigation.getCurrentCartoDBLayerOptions();

      cMarkers.featureClick       = cMarkersClassicInfowindow;
      currentLayer.featureClick   = cMarkersClassicInfowindow;

      window.navigation.replaceCartoDBLayer(currentLayer);

      if (show) {
        infowindow.model.set(classicInfowindow);
        infowindow.show();
      }

      // legend.hide();
      // switcher.hide();
    }

  },

  different_markers_for_different_categories: {
    on:  function(e) { window.navigation.getCartoDBLayer().set("tile_style", styles.markers.special); },
    off: function(e) { window.navigation.getCartoDBLayer().set("tile_style", styles.markers.base); }
  }
};

callbacks.checkbox.polygons = {

  dynamic_filters: {
    on:  function() {

      selector.collection = new cdb.geo.ui.SelectorItems([
        { name: "All" ,   callback: null },
        { name: "High",   callback: null },
        { name: "Medium", callback: null },
        { name: "Low" ,   callback: null }
      ]);

      mapView.$el.parent().append(selector.render().$el);
      selector.show();

      $(".dk").dropkick({
        change: function (value, label) {

          var query;

          if (value == "All") {
            query = "SELECT cartodb_id, category, the_geom_webmercator FROM {{table_name}}";
          } else if (value == "High") {
            query = "SELECT cartodb_id, category, the_geom_webmercator FROM {{table_name}} WHERE category = 'high'";
          } else if ( value == "Medium") {
            query = "SELECT cartodb_id, category, the_geom_webmercator FROM {{table_name}} WHERE category = 'medium'";
          } else if (value == "Low") {
            query = "SELECT cartodb_id, category, the_geom_webmercator FROM {{table_name}} WHERE category = 'low'";
          }

          infowindow.hide(true);
          window.navigation.getCartoDBLayer().set("query", query);
        }
      });

    },

    off: function() {
      selector.hide();
    }
  },

  different_styles_for_different_types_of_polygons: {
    on:  function(e) { window.navigation.getCartoDBLayer().set("tile_style", styles.polygons.special); },
    off: function(e) { window.navigation.getCartoDBLayer().set("tile_style", styles.polygons.base); }
  }

};

callbacks.checkbox.density = {
  variable_selection: {
    on: function() {

      selector.collection = new cdb.geo.ui.SelectorItems([
        { name: "All" ,   callback: null },
        { name: "High",   callback: null },
        { name: "Medium", callback: null },
        { name: "Low" ,   callback: null }
      ]);

      mapView.$el.parent().append(selector.render().$el);
      selector.show();

      $(".dk").dropkick({
        change: function (value, label) {

          var query;

          if (value == "All") {
            query = "SELECT cartodb_id, category, the_geom_webmercator FROM {{table_name}}";
          } else if (value == "High") {
            query = "SELECT cartodb_id, category, the_geom_webmercator FROM {{table_name}} WHERE category = 'high'";
          } else if ( value == "Medium") {
            query = "SELECT cartodb_id, category, the_geom_webmercator FROM {{table_name}} WHERE category = 'medium'";
          } else if (value == "Low") {
            query = "SELECT cartodb_id, category, the_geom_webmercator FROM {{table_name}} WHERE category = 'low'";
          }

          infowindow.hide(true);
          //window.navigation.getCartoDBLayer().set("query", query);
        }
      });

    },
    off: function() {
      selector.hide();
    }
  }


};


callbacks.checkbox.thematic =  {
  variable_selection: {
    on: function() {

      selector.collection = new cdb.geo.ui.SelectorItems([
        { name: "Select a category" , callback: null },
        {
          name: "All" , callback: function() {
          }},
          {
            name: "High" , callback: function() {
            }},

            { name: "Medium" , callback: function() {
            }},

            { name: "Low" , callback: function() {
            }}
      ]);

      mapView.$el.parent().append(selector.render().$el);
      selector.show();

    },
    off: function() {
      selector.hide();
    }
  }

};

callbacks.checkbox.dont_know = null;

callbacks.radio.markers  = function() { console.log('a'); };
callbacks.radio.polygons = {};
callbacks.radio.density  = {
  on: function(e) {

    if (window.navigation && e.model.get("option_name") == "rectangular_grid") {
      window.map.bind('change:zoom', function() {
        z = window.map.getZoom();
        var l = window.navigation.getBaseLayer();
        var url = 'https://examples.cartodb.com/tiles/points_na/{z}/{x}/{y}.png?' + statements[z];
        l.set("urlTemplate", url);
      });
    }

    if (window.navigation && e.model.get("option_name") == "hexagonal_grid") {
      window.navigation.loadLayers(layers.hexagons);

      window.map.unbind('change:zoom');
      legend.show();

    }
  },
  off: function(e) {
    if (e.model.get("option_name") == "hexagonal_grid") {
      window.navigation.loadLayers(layers.density);
      legend.hide();

    }
  }
};

callbacks.radio.thematic  = {
  on: function(e) {
    if (window.navigation && e.model.get("option_name") == "choropleth_map") {
      window.navigation.loadLayers(layers.thematic);
    }
  },
  off: function(e) {
    if (e.model.get("option_name") == "choropleth_map") {
      window.navigation.loadLayers(layers.bubbles);
    }

  }
};
callbacks.radio.dont_know = null;
