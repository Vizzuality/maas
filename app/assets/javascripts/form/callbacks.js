thematicValue = "population";

polygonCategories = [ "Ib", "II", "IV", "V", "VI" ];

var callbacks = {};

callbacks.checkbox = {};
callbacks.radio    = {};

callbacks.checkbox.markers = {

  dynamic_filters: {
    on:  function() {

      var collection = new cdb.geo.ui.OverlayItems([
        { className: 'all', selected: true, name: "All sites",
          on:  function() {
            var query = 'SELECT cartodb_id, the_geom_webmercator, ST_AsGeoJSON(the_geom) AS latlng, src, title, subtitle, description, category FROM {{table_name}}';
            window.navigation.getCartoDBLayer().set("query", query);
          }
        },
        { className: 'natural', selected: false, name: "Natural sites",
          on:  function() {
            var query = "SELECT cartodb_id, the_geom_webmercator, ST_AsGeoJSON(the_geom) AS latlng, src, title, subtitle, description, category FROM {{table_name}} WHERE category = 'natural'";
            window.navigation.getCartoDBLayer().set("query", query);
          }
        },
        { className: 'cultural', selected: false, name: "Cultural sites",
          on:  function() {
            var query = "SELECT cartodb_id, the_geom_webmercator, ST_AsGeoJSON(the_geom) AS latlng, src, title, subtitle, description, category FROM {{table_name}} WHERE category = 'cultural'";
            window.navigation.getCartoDBLayer().set("query", query);
          }
        }]);

        window.map.overlay.model.set("title", "");
        window.map.overlay.model.set("className", "markers");
        window.map.overlay.model.set("mode", "radio");
        overlay.setCollection(collection);
        window.map.overlay.show();


    },
    off: function() {
      overlay.hide();
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
        infowindow.model.set({offset: infowindows.photo.offset, template_name: infowindows.photo.template_name });
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
        infowindow.model.set({offset: infowindows.classic.offset, template_name: infowindows.classic.template_name });
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

function getPolygonQueryRemoving(item) {
  polygonCategories =_.without(polygonCategories, item);
  return "SELECT cartodb_id, desig, desig_type, iucn_cat, name, the_geom_webmercator FROM {{table_name}} WHERE iucn_cat IN ('" + polygonCategories.join("','") + "')";
}

function getPolygonQueryAdding(item) {

  if (!_.has(polygonCategories, item)) {
    polygonCategories.push(item);
  }

  return "SELECT cartodb_id, desig, desig_type, iucn_cat, name, the_geom_webmercator FROM {{table_name}} WHERE iucn_cat IN ('" + polygonCategories.join("','") + "')";
}

callbacks.checkbox.polygons = {

  dynamic_filters: {
    on:  function() {

      window.map.overlay.model.set("title", "Category");
      window.map.overlay.model.set("className", "polygons");
      window.map.overlay.model.set("mode", "checkbox");

      var collection = new cdb.geo.ui.OverlayItems([
        { className: 'Ib', selected: true, name: "Ib",
          on:  function() { infowindow.hide(true); window.navigation.getCartoDBLayer().set("query", getPolygonQueryAdding('Ib')); },
          off: function() { infowindow.hide(true); window.navigation.getCartoDBLayer().set("query", getPolygonQueryRemoving('Ib')); }
        },
        { className: 'II', selected: true, name: "II",
          on:  function() { infowindow.hide(true); window.navigation.getCartoDBLayer().set("query", getPolygonQueryAdding('II')); },
          off: function() { infowindow.hide(true); window.navigation.getCartoDBLayer().set("query", getPolygonQueryRemoving('II')); }
        },
        { className: 'IV', selected: true, name: "IV",
          on:  function() { infowindow.hide(true); window.navigation.getCartoDBLayer().set("query", getPolygonQueryAdding('IV')); },
          off: function() { infowindow.hide(true); window.navigation.getCartoDBLayer().set("query", getPolygonQueryRemoving('IV')); }
        },
        { className: 'V', selected: true, name: "V",
          on:  function() { infowindow.hide(true); window.navigation.getCartoDBLayer().set("query", getPolygonQueryAdding('V')); },
          off: function() { infowindow.hide(true); window.navigation.getCartoDBLayer().set("query", getPolygonQueryRemoving('V')); }
        },
        { className: 'VI', selected: true, name: "VI",
          on:  function() { infowindow.hide(true); window.navigation.getCartoDBLayer().set("query", getPolygonQueryAdding('VI')); },
          off: function() { infowindow.hide(true); window.navigation.getCartoDBLayer().set("query", getPolygonQueryRemoving('VI')); }
        }
      ]);

      overlay.setCollection(collection);
      overlay.show();

      $(".dk").dropkick({
        change: function (value, label) {

          var query;

          if (value == "All types of government") {
            query = "SELECT cartodb_id, gov_type, name, the_geom_webmercator FROM {{table_name}}";
          } else if (value == "Governance by government") {
            query = "SELECT cartodb_id, gov_type, name, the_geom_webmercator FROM {{table_name}} WHERE gov_type = 'Governance by government'";
          } else if (value == "Shared governance") {
            query = "SELECT cartodb_id, gov_type, name, the_geom_webmercator FROM {{table_name}} WHERE gov_type = 'Shared governance'";
          } else if (value == "Not Reported") {
            query = "SELECT cartodb_id, gov_type, name, the_geom_webmercator FROM {{table_name}} WHERE gov_type = 'Not Reported'";
          }

          infowindow.hide(true);
          window.navigation.getCartoDBLayer().set("query", query);
        }
      });

    },

    off: function() {
      overlay.hide();
    }
  },
  custom_infowindows: {

    on: function() {
      if (!infowindow.isHidden()) var show = true;
      infowindow.hide(true);

      var currentLayer = window.navigation.getCurrentCartoDBLayerOptions();

      cPolygons.featureClick      = cPolygonsNewInfowindow;
      currentLayer.featureClick   = cPolygonsNewInfowindow;

      window.navigation.replaceCartoDBLayer(currentLayer);

      if (show) {
        infowindow.model.set({offset: infowindows.polygons.offset, template_name: infowindows.polygons.template_name });
        infowindow.show();
      }
    },

    off: function() {
      if (!infowindow.isHidden()) var show = true;
      infowindow.hide(true);
      var currentLayer = window.navigation.getCurrentCartoDBLayerOptions();

      cMarkers.featureClick       = cPolygonsClassicInfowindow;
      currentLayer.featureClick   = cPolygonsClassicInfowindow;

      window.navigation.replaceCartoDBLayer(currentLayer);

      if (show) {
        infowindow.model.set({offset: infowindows.classic.offset, template_name: infowindows.classic.template_name });
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

      var collection = new cdb.geo.ui.OverlayItems([
        { className: 'javascript', selected: true, name: "Javascript developers",
          on:  function() {
            var hexagonSelected = activePane.collection.at(1).get("selected");

            if (hexagonSelected) {
              query = "WITH hgrid AS (SELECT CDB_HexagonGrid(ST_Expand(CDB_XYZ_Extent({x},{y},{z}), CDB_XYZ_Resolution({z}) * 15), CDB_XYZ_Resolution({z}) * 15) AS cell) " +
                "SELECT hgrid.cell AS the_geom_webmercator, COUNT(i.cartodb_id) AS prop_count FROM hgrid, github_developers i " +
                "WHERE language = 'javascript' AND ST_Intersects(i.the_geom_webmercator, hgrid.cell ) GROUP BY hgrid.cell"; 
            } else {
              query = "WITH hgrid AS (SELECT CDB_RectangleGrid(ST_Expand(CDB_XYZ_Extent({x},{y},{z}),CDB_XYZ_Resolution({z}) * 15), CDB_XYZ_Resolution({z}) * 15, CDB_XYZ_Resolution({z}) * 15 ) AS cell) " +
                "SELECT hgrid.cell AS the_geom_webmercator, count(i.cartodb_id) AS prop_count FROM hgrid, github_developers i " +
                "WHERE language = 'javascript' AND ST_Intersects(i.the_geom_webmercator, hgrid.cell) GROUP BY hgrid.cell";
            }
            window.navigation.getCartoDBLayer().set('query', query);
          }
        },
        { className: 'ruby', selected: false, name: "Ruby developers",
          on:  function() {
            var hexagonSelected = activePane.collection.at(1).get("selected");

            if (hexagonSelected) {
              query = "WITH hgrid AS (SELECT CDB_HexagonGrid(ST_Expand(CDB_XYZ_Extent({x},{y},{z}), CDB_XYZ_Resolution({z}) * 15), CDB_XYZ_Resolution({z}) * 15) AS cell) " +
                "SELECT hgrid.cell AS the_geom_webmercator, COUNT(i.cartodb_id) AS prop_count FROM hgrid, github_developers i " +
                "WHERE language = 'ruby' AND ST_Intersects(i.the_geom_webmercator, hgrid.cell ) GROUP BY hgrid.cell";
            } else {
              query = "WITH hgrid AS (SELECT CDB_RectangleGrid(ST_Expand(CDB_XYZ_Extent({x},{y},{z}),CDB_XYZ_Resolution({z}) * 15), CDB_XYZ_Resolution({z}) * 15, CDB_XYZ_Resolution({z}) * 15 ) AS cell) " +
                "SELECT hgrid.cell AS the_geom_webmercator, count(i.cartodb_id) AS prop_count FROM hgrid, github_developers i " +
                "WHERE language = 'ruby' AND ST_Intersects(i.the_geom_webmercator, hgrid.cell) GROUP BY hgrid.cell";
            }

            window.navigation.getCartoDBLayer().set('query', query);
          }
        }]);

        window.map.overlay.model.set("title", "");
        window.map.overlay.model.set("className", "markers");
        window.map.overlay.model.set("mode", "radio");
        overlay.setCollection(collection);
        window.map.overlay.show();
    },
    off: function() {
      overlay.hide();
    }
  }


};


callbacks.checkbox.thematic =  {
  custom_infowindows: {

    on: function() {
      if (!infowindow.isHidden()) var show = true;
      infowindow.hide(true);

      var currentLayer = window.navigation.getCurrentCartoDBLayerOptions();

      cThematic.featureClick      = cThematicNewInfowindow;
      currentLayer.featureClick   = cThematicNewInfowindow;

      window.navigation.replaceCartoDBLayer(currentLayer);

      if (show) {
        infowindow.model.set({offset: infowindows.small.offset, template_name: infowindows.small.template_name });
        infowindow.show();
      }
    },

    off: function() {
      if (!infowindow.isHidden()) var show = true;
      infowindow.hide(true);
      var currentLayer = window.navigation.getCurrentCartoDBLayerOptions();

      cMarkers.featureClick       = cThematicClassicInfowindow;
      currentLayer.featureClick   = cThematicClassicInfowindow;

      window.navigation.replaceCartoDBLayer(currentLayer);

      if (show) {
        infowindow.model.set({offset: infowindows.classic.offset, template_name: infowindows.classic.template_name });
        infowindow.show();
      }
    }
  },

  variable_selection: {
    on: function(e) {

      var collection = new cdb.geo.ui.OverlayItems([
        { className: 'population', selected: true, name: "Population",
          on:  function() {
            thematicValue = "population";

            infowindow.hide(true);

            var choroplethSelected = activePane.collection.at(1).get("selected");

            if (choroplethSelected)
              window.navigation.getCartoDBLayer().set("tile_style", styles.thematic.choropleth.population);
            else
              window.navigation.getCartoDBLayer().set("tile_style", styles.thematic.bubble.population);
          }
        },
        { className: 'gdp', selected: false, name: "GDP",
          on:  function() {
            infowindow.hide(true);
            thematicValue = "gpd";

            var choroplethSelected = activePane.collection.at(1).get("selected");

            if (choroplethSelected)
              window.navigation.getCartoDBLayer().set("tile_style", styles.thematic.choropleth.gdp);
            else
              window.navigation.getCartoDBLayer().set("tile_style", styles.thematic.bubble.gdp);
          }
        }]);

        window.map.overlay.model.set("title", "");
        window.map.overlay.model.set("className", "markers");
        window.map.overlay.model.set("mode", "radio");
        overlay.setCollection(collection);
        window.map.overlay.show();
    },

    off: function() {
      overlay.hide();
    }
  }

};

callbacks.checkbox.dont_know = null;

callbacks.radio.markers  = {};
callbacks.radio.polygons = {};
callbacks.radio.density  = {
  init: function(e) {

    legend.show();
  },
  on: function(e) {

    if (!window.navigation) return;

    var query = "";

    var selectedOptionName = undefined;
    var selectedOption = overlay.getSelectedItem();

    if (selectedOption) selectedOptionName = selectedOption.get("name");

    if (e.model.get("option_name") == "hexagonal_grid") {

      if (selectedOptionName == 'javascript' || selectedOptionName == undefined) {

        query = "WITH hgrid AS (SELECT CDB_HexagonGrid(ST_Expand(CDB_XYZ_Extent({x},{y},{z}), CDB_XYZ_Resolution({z}) * 15), CDB_XYZ_Resolution({z}) * 15) AS cell) " +
          "SELECT hgrid.cell AS the_geom_webmercator, COUNT(i.cartodb_id) AS prop_count FROM hgrid, github_developers i " +
          "WHERE language = 'javascript' AND ST_Intersects(i.the_geom_webmercator, hgrid.cell ) GROUP BY hgrid.cell"; 
      } else {
        query = "WITH hgrid AS (SELECT CDB_HexagonGrid(ST_Expand(CDB_XYZ_Extent({x},{y},{z}), CDB_XYZ_Resolution({z}) * 15), CDB_XYZ_Resolution({z}) * 15) AS cell) " +
          "SELECT hgrid.cell AS the_geom_webmercator, COUNT(i.cartodb_id) AS prop_count FROM hgrid, github_developers i " +
          "WHERE language = 'ruby' AND ST_Intersects(i.the_geom_webmercator, hgrid.cell ) GROUP BY hgrid.cell"; 

      }

    } else if (e.model.get("option_name") == "rectangular_grid") {

      if (selectedOptionName == 'javascript' || selectedOptionName == undefined) {
        query = "WITH hgrid AS (SELECT CDB_RectangleGrid(ST_Expand(CDB_XYZ_Extent({x},{y},{z}),CDB_XYZ_Resolution({z}) * 15), CDB_XYZ_Resolution({z}) * 15, CDB_XYZ_Resolution({z}) * 15 ) AS cell) " +
          "SELECT hgrid.cell AS the_geom_webmercator, count(i.cartodb_id) AS prop_count FROM hgrid, github_developers i " +
          "WHERE language = 'javascript' AND ST_Intersects(i.the_geom_webmercator, hgrid.cell) GROUP BY hgrid.cell";

      } else {
        query = "WITH hgrid AS (SELECT CDB_RectangleGrid(ST_Expand(CDB_XYZ_Extent({x},{y},{z}),CDB_XYZ_Resolution({z}) * 15), CDB_XYZ_Resolution({z}) * 15, CDB_XYZ_Resolution({z}) * 15 ) AS cell) " +
          "SELECT hgrid.cell AS the_geom_webmercator, count(i.cartodb_id) AS prop_count FROM hgrid, github_developers i " +
          "WHERE language = 'ruby' AND ST_Intersects(i.the_geom_webmercator, hgrid.cell) GROUP BY hgrid.cell";
      }
    }

    window.navigation.getCartoDBLayer().set('query', query);
  },
  off: function(e) { }
};

callbacks.radio.thematic  = {
  on: function(e) {

    if (!window.navigation) return;

    var selectedOptionName = undefined;
    var selectedOption = overlay.getSelectedItem();

    if (selectedOption) selectedOptionName = selectedOption.get("name");

    if (e.model.get("option_name") == "bubble_map") {

      if (selectedOptionName == 'Population' || selectedOptionName == undefined) {
        window.navigation.getCartoDBLayer().set("tile_style", styles.thematic.bubble.population);
      } else {
        window.navigation.getCartoDBLayer().set("tile_style", styles.thematic.bubble.gdp);
      }

    } else if (e.model.get("option_name") == "choropleth_map") {

      if (selectedOptionName == 'Population' || selectedOptionName == undefined) {
        window.navigation.getCartoDBLayer().set("tile_style", styles.thematic.choropleth.population);
      } else {
        window.navigation.getCartoDBLayer().set("tile_style", styles.thematic.choropleth.gdp);
      }
    }

  },

  off: function(e) { }
};

callbacks.radio.dont_know = null;
