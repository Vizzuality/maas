/**
* Styles for the different layers
*/

var assetsPath = "/home/ubuntu/tile_assets/maas/";

var styles = {
  polygons: {
    base:    "#polygons { polygon-fill: orange; polygon-opacity: 0.7; line-opacity: 1; line-color: #FFFFFF; }",
    special: "#polygons { polygon-fill:#FFCA5F; polygon-opacity: 0.8; line-opacity:0.6; line-color: #FFFFFF; polygon-pattern-file: url(" + assetsPath + "maas_cross1.png); "+
    "[iucn_cat = 'Ib']  { polygon-fill:#FF013F; polygon-pattern-file: url(" + assetsPath + "maas_cross1.png); } " +
    "[iucn_cat = 'II']  { polygon-fill:#FB8B01; polygon-pattern-file: url(" + assetsPath + "maas_diag1.png);  } " +
    "[iucn_cat = 'III'] { polygon-fill:#FABE28; polygon-pattern-file: url(" + assetsPath + "maas_diag1.png);  } " +
    "[iucn_cat = 'IV']  { polygon-fill:#339199; polygon-pattern-file: url(" + assetsPath + "maas_dots1.png);  } " +
    "[iucn_cat = 'VI']  { polygon-fill:#3A6367; polygon-pattern-file: url(" + assetsPath + "maas_diag1.png);  } " +
    "[iucn_cat = 'Not Reported'] { polygon-fill:#3A6367; polygon-pattern-file: url(" + assetsPath + "maas_dots1.png); } " +
    "}"
  },
  markers: {
    base: "#markers { marker-fill: #FF6600; " +
      "marker-opacity: 1; " +
      "marker-width: 8;" +
      "marker-line-color: white; " +
      "marker-line-width: 3; " +
      "marker-line-opacity: 0.9; " +
      "marker-placement: point; " +
      "marker-type: ellipse; " +
      "marker-allow-overlap: true; }",
    special: "#markers { " +
    "[category='cultural'] { point-file: url(/home/ubuntu/tile_assets/maas/maas_markers_cultural.png); marker-opacity: 0; marker-line-opacity: 0; marker-width:  27px; marker-height: 28px; } " +
    "[category='natural']  { point-file: url(/home/ubuntu/tile_assets/maas/maas_markers_natural.png); marker-opacity: 0; marker-line-opacity: 0; } " +
    "}"
  },
  density: {
    hexagons: "#github_developers { " +
    "[prop_count>0]   { polygon-fill: #313695; } " +
    "[prop_count>1]   { polygon-fill: #4575B4; } " +
    "[prop_count>2]   { polygon-fill: #74ADD1; } " +
    "[prop_count>4]   { polygon-fill: #ABD9E9; } " +
    "[prop_count>10]  { polygon-fill: #E0F3F8; } " +
    "[prop_count>16]  { polygon-fill: #FFFFBF; } " +
    "[prop_count>32]  { polygon-fill: #FEE090; } " +
    "[prop_count>64]  { polygon-fill: #FDAE61; } " +
    "[prop_count>128] { polygon-fill: #F46D43; } " +
    "[prop_count>256] { polygon-fill: #D73027; } " +
    "[prop_count>512] { polygon-fill: #A50026; } " +
    "polygon-opacity:0.71; line-width:0; " +
    "}",
  },
  thematic: {
    bubble: {
      population: "#choropleth { " +
        "marker-fill: #41B6C4; " +
        "marker-line-color: #FFFFFF; " +
        "marker-line-width: 0; " +
        "marker-opacity: .7; " +
        "marker-line-opacity: 0; " +
        "marker-placement: point; " +
        "marker-type: ellipse; " +
        "marker-allow-overlap: true; } " +
        "#choropleth [pop_est<=1000000000] { marker-width: 13 } " +
        "#choropleth [pop_est<=30000000]   { marker-width: 11 } " +
        "#choropleth [pop_est<=10800000]   { marker-width: 9 } " +
        "#choropleth [pop_est<=6000000]    { marker-width: 7 } " +
        "#choropleth [pop_est<=2000000]    { marker-width: 6 }",
      gdp: "#choropleth { " +
        "   marker-fill:#F03B20; " +
        "   marker-line-color:#FFFFFF; " +
        "   marker-line-width:1; " +
        "   marker-opacity:.7; " +
        "   marker-line-opacity:0; " +
        "   marker-placement:point; " +
        "   marker-type:ellipse; " +
        "   marker-allow-overlap:true; " +
        "} " +
        "#choropleth [gdp_md_est<=14260000] { marker-width:23 } " +
        "#choropleth [gdp_md_est<=800200] { marker-width:21 }   " +
        "#choropleth [gdp_md_est<=335400] { marker-width:19 }   " +
        "#choropleth [gdp_md_est<=188400] { marker-width:17 }   " +
        "#choropleth [gdp_md_est<=88080]  { marker-width:15 }   " +
        "#choropleth [gdp_md_est<=44060]  { marker-width:13 }   " +
        "#choropleth [gdp_md_est<=28890]  { marker-width:11 }   " +
        "#choropleth [gdp_md_est<=17820]  { marker-width:9 }    " +
        "#choropleth [gdp_md_est<=10040]  { marker-width:7 }    " +
        "#choropleth [gdp_md_est<=3158]   { marker-width:6 }    "
    },
    choropleth: {
      population: "#choropleth { line-color:#FFFFFF; line-width:1; line-opacity:0.72; polygon-opacity:0.72; } " +
        "#choropleth [pop_est<=1338612968] { polygon-fill:#253494 } " +
        "#choropleth [pop_est<=33487208] { polygon-fill:#2C7FB8 } " +
        "#choropleth [pop_est<=11862740] { polygon-fill:#41B6C4 } " +
        "#choropleth [pop_est<=6057263] { polygon-fill:#A1DAB4 } " +
        "#choropleth [pop_est<=2231503] { polygon-fill:#FFFFCC } ",
      gdp: "#choropleth { " +
        "line-color:#FFFFFF;" +
        "line-width:1;" +
        "line-opacity:1;" +
        "polygon-opacity:1; } " +
        "#choropleth [pop_est<=1338612968] { polygon-fill:#BD0026 }" +
        "#choropleth [pop_est<=33487208] { polygon-fill:#F03B20 }" +
        "#choropleth [pop_est<=11862740] { polygon-fill:#FD8D3C }" +
        "#choropleth [pop_est<=6057263] { polygon-fill:#FECC5C }" +
        "#choropleth [pop_est<=2231503] { polygon-fill:#FFFFB2 }"
    }
  }
};


