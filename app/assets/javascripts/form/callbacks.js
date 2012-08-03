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
            selector.select(0);
            query = 'SELECT cartodb_id, the_geom_webmercator, ST_AsGeoJSON(the_geom) AS latlng, src, title, subtitle, description, category FROM {{table_name}}';
          } else if (value == "Natural") {
            selector.select(1);
            query = "SELECT cartodb_id, the_geom_webmercator, ST_AsGeoJSON(the_geom) AS latlng, src, title, subtitle, description, category FROM {{table_name}} WHERE category = 'natural'";
          } else if (value == "Cultural") {
            selector.select(2);
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
    on: function(e) {
      selector.collection = new cdb.geo.ui.SelectorItems([
        { name: "Population",   callback: null },
        { name: "Gross domestic product", callback: null }
      ]);

      mapView.$el.parent().append(selector.render().$el);
      selector.show();

      $(".dk").dropkick({
        change: function (value, label) {
          var query;
          var choroplethSelected = activePane.collection.at(1).get("selected");

          if (value == "Population") {

            if (choroplethSelected)
              window.navigation.getCartoDBLayer().set("tile_style", styles.thematic.choropleth.population);
            else
              window.navigation.getCartoDBLayer().set("tile_style", styles.thematic.bubble.population);

          } else if (value == "Gross domestic product") {
            if (choroplethSelected)
              window.navigation.getCartoDBLayer().set("tile_style", styles.thematic.choropleth.gdp);
            else
              window.navigation.getCartoDBLayer().set("tile_style", styles.thematic.bubble.gdp);
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

callbacks.checkbox.dont_know = null;

callbacks.radio.markers  = {};
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
    if (window.navigation) {
      if (e.model.get("option_name") == "bubble_map") {
        window.navigation.getCartoDBLayer().set("tile_style", styles.thematic.bubble.population);
      } else if (e.model.get("option_name") == "choropleth_map") {
        window.navigation.getCartoDBLayer().set("tile_style", styles.thematic.choropleth.population);
      }
    }
  },
  off: function(e) {
    if (e.model.get("option_name") == "choropleth_map") {
      window.navigation.getCartoDBLayer().set("tile_style", styles.thematic.bubble.population);
    }
  }
};

callbacks.radio.dont_know = null;
