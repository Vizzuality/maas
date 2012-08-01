var styles = {
  polygons: {
    base:    "#polygons { polygon-fill:orange; polygon-opacity: 0.7; line-opacity:1; line-color: #FFFFFF; }",
    special: "#polygons " +
             "{ " +
             " polygon-fill:#FFFFFF; polygon-opacity: 0.7; line-opacity:1; line-color: #FFFFFF; " +
             " [category = 'high']   { polygon-fill:#FFA22B; polygon-pattern-file:url('/home/ubuntu/tile_assets/maas/maas_cross1.png'); } " +
             " [category = 'medium'] { polygon-fill:#B81E20; polygon-pattern-file:url('/home/ubuntu/tile_assets/maas/maas_diag1.png');  } " +
             " [category = 'low']    { polygon-fill:#F3441E; polygon-pattern-file:url('/home/ubuntu/tile_assets/maas/maas_dots1.png');  } " +
             "}"
  },
  markers: {
    base: "#markers { marker-fill: #FF6600; marker-opacity: 1; marker-width: 8; marker-line-color: white; marker-line-width: 3; marker-line-opacity: 0.9; marker-placement: point; marker-type: ellipse; marker-allow-overlap: true; }",
    special: ""
  }
};

