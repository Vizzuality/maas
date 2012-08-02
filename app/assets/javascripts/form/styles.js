var styles = {
  polygons: {
    base:    "#polygons { polygon-fill: orange; polygon-opacity: 0.7; line-opacity: 1; line-color: #FFFFFF; }",
    special: "#polygons " +
      "{ " +
        " polygon-fill: #FFFFFF; polygon-opacity: 0.7; line-opacity: 1; line-color: #FFFFFF; " +
      " [category = 'high']   { polygon-fill: #FFA22B; polygon-pattern-file: url('/home/ubuntu/tile_assets/maas/maas_cross1.png'); } " +
      " [category = 'medium'] { polygon-fill: #B81E20; polygon-pattern-file: url('/home/ubuntu/tile_assets/maas/maas_diag1.png');  } " +
      " [category = 'low']    { polygon-fill: #F3441E; polygon-pattern-file: url('/home/ubuntu/tile_assets/maas/maas_dots1.png');  } " +
      "}"
  },
  markers: {
    base: "#markers { marker-fill: #FF6600; marker-opacity: 1; " +
      "marker-width: 8;" +
      "marker-line-color: white; " +
      "marker-line-width: 3; " +
      "marker-line-opacity: 0.9; " +
      "marker-placement: point; " +
      "marker-type: ellipse; " +
      "marker-allow-overlap: true; }",
    special: ""
  },
  thematic: {
    bubble: {
      population: "#choropleth { " +
        "marker-fill: #FF6600; " +
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
        "   marker-fill:#FF6600; " +
        "   marker-line-color:#FFFFFF; " +
        "   marker-line-width:1; " +
        "   marker-opacity:1; " +
        "   marker-line-opacity:1; " +
        "   marker-placement:point; " +
        "   marker-type:ellipse; " +
        "   marker-allow-overlap:true; " +
        "} " +
        "#choropleth [gdp_md_est<=14260000] { marker-width:23 } " +
        "#choropleth [gdp_md_est<=800200] { marker-width:21.11111111111111 } "  +
        "#choropleth [gdp_md_est<=335400] { marker-width:19.22222222222222 } "  +
        "#choropleth [gdp_md_est<=188400] { marker-width:17.333333333333332 } " +
        "#choropleth [gdp_md_est<=88080] { marker-width:15.444444444444445 } "  +
        "#choropleth [gdp_md_est<=44060] { marker-width:13.555555555555555 } "  +
        "#choropleth [gdp_md_est<=28890] { marker-width:11.666666666666666 } "  +
        "#choropleth [gdp_md_est<=17820] { marker-width:9.777777777777779 } "   +
        "#choropleth [gdp_md_est<=10040] { marker-width:7.888888888888889 } "   +
        "#choropleth [gdp_md_est<=3158] { marker-width:6 } "
    },
    choropleth: {
      population: "#choropleth { line-color: #FFFFFF; line-width: 1; line-opacity: 1; polygon-opacity: 1; } " +
        "#choropleth [pop_est<=1338612968] { polygon-fill: #006D2C } " +
        "#choropleth [pop_est<=33487208]   { polygon-fill: #2CA25F } " +
        "#choropleth [pop_est<=11862740]   { polygon-fill: #66C2A4 } " +
        "#choropleth [pop_est<=6057263]    { polygon-fill: #B2E2E2 } " +
        "#choropleth [pop_est<=2231503]    { polygon-fill: #EDF8FB } ",
      gdp: "#choropleth { line-color:#FFFFFF; line-width:1; line-opacity:1; polygon-opacity:1; } " +
        "#choropleth [gdp_md_est<=14260000] { polygon-fill:#006D2C } " +
        "#choropleth [gdp_md_est<=329500] { polygon-fill:#2CA25F } " +
        "#choropleth [gdp_md_est<=81710] { polygon-fill:#66C2A4 } " +
        "#choropleth [gdp_md_est<=27940] { polygon-fill:#B2E2E2 } " +
        "#choropleth [gdp_md_est<=10040] { polygon-fill:#EDF8FB }"
    }
  }
};

