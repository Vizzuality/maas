function createCalls(seed, bottomZ) {
  var
  z     = bottomZ,
  topZ  = bottomZ + 6,
  statements = {};

  // Define our base grid style
  var baseStyle = "%23points_na{ polygon-fill:%23EFF3FF; polygon-opacity:0.6; line-opacity:1; line-color:%23FFFFFF;  ";

    // Add grid colors based on count (cnt) in clusters
    baseStyle += "[cnt%3E160] { polygon-fill:%2308519C; polygon-opacity:0.7;  } " +
      "[cnt%3C160] { polygon-fill:%233182BD; polygon-opacity:0.65; } " +
      "[cnt%3C80]  { polygon-fill:%236BAED6; polygon-opacity:0.6;  } " +
      "[cnt%3C40]  { polygon-fill:%239ECAE1; polygon-opacity:0.6;  } " +
      "[cnt%3C20]  { polygon-fill:%23C6DBEF; polygon-opacity:0.6;  } " +
      "[cnt%3C2]   { polygon-fill:%23EFF3FF; polygon-opacity:0.4;  }} ";

    // Get the first level (lowest zoom) set of points clustered
    var
    sql   = "SELECT cnt, ST_Transform(ST_Envelope(GEOMETRYFROMTEXT('LINESTRING('||(st_xmax(the_geom)-"+(seed/2)+")||' '||(st_ymax(the_geom)-"+(seed/2)+")||', '||(st_xmax(the_geom)%2B"+(seed/2)+")||' '||(st_ymax(the_geom)%2B"+(seed/2)+")||')',4326)),3857) as the_geom_webmercator FROM (SELECT count(*) as cnt, ST_SnapToGrid(the_geom, 0%2B"+(seed/2)+", 75%2B"+(seed/2)+", "+seed+", "+seed+") as the_geom FROM points_na GROUP By ST_SnapToGrid(the_geom, 0%2B"+(seed/2)+", 75%2B"+(seed/2)+", "+seed+", "+seed+")) points_na WHERE ST_Intersects(the_geom, GEOMETRYFROMTEXT('MULTIPOLYGON(((-180 75, -180 -75, 180 -75, 180 75, -180 75)))',4326))";
    seed  = seed/2;
    style = baseStyle;

    statements[0] = "sql=" + sql + "&style=" + style;

    // Create a clustering SQL statement and a style for each zoom < topZ
    while (z < topZ) {
      sql = "SELECT cnt, ST_Transform(ST_Envelope(GEOMETRYFROMTEXT('LINESTRING('||(st_xmax(the_geom)-"+(seed/2)+")||' '||(st_ymax(the_geom)-"+(seed/2)+")||', '||(st_xmax(the_geom)%2B"+(seed/2)+")||' '||(st_ymax(the_geom)%2B"+(seed/2)+")||')',4326)),3857) as the_geom_webmercator FROM (SELECT count(*) as cnt, ST_SnapToGrid(the_geom, 0%2B"+(seed/2)+", 75%2B"+(seed/2)+", "+seed+", "+seed+") as the_geom FROM points_na GROUP By ST_SnapToGrid(the_geom, 0%2B"+(seed/2)+", 75%2B"+(seed/2)+", "+seed+", "+seed+")) points_na WHERE ST_Intersects(the_geom, GEOMETRYFROMTEXT('MULTIPOLYGON(((-180 75, -180 -75, 180 -75, 180 75, -180 75)))',4326))";
      statements[z] = "sql=" + sql + "&style=" + style;
      z++;
      seed = seed/2;
    }

    z = z-1;

    // Create a statement for all points and a style for those points at zoom >= 10
    sql   = "SELECT 1 as cnt, the_geom_webmercator FROM points_na ";
    style = "%23points_na { " +
      "marker-fill:%23E25B5B; " +
      "marker-opacity:0.9; " +
      "marker-width:3; " +
      "marker-line-color:white;" +
      "marker-line-width:1;" +
      "marker-line-opacity:0.8;" +
      "marker-placement:point;" +
      "marker-type:ellipse;" +
      "marker-allow-overlap:true; } ";

    statements[topZ] = "sql=" + sql + "&style=" + style;

    return statements;
}


function createBubbleCalls(seed, bottomZ) {

  var
  z     = bottomZ,
  topZ  = 9,
  style = "",
  statements = {};


    var // Define our base marker style
    baseStyle = "%23points_na { "+
      "marker-fill:%23E25B5B;" +
      "marker-opacity:0;" +
      "marker-width:28;" +
      "marker-line-color:white;" +
      "marker-line-width:3;" +
      "marker-line-opacity:0;" +
      "marker-placement:point;" +
      "marker-type:ellipse;" +
      "marker-allow-overlap:true;";

    // Add marker sizes based on count (cnt) in clusters */
    baseStyle += "" +
      "[cnt%3E500] { marker-width:32;} " +
      "[cnt%3C500] { marker-width:25; } " +
      "[cnt%3C200] { marker-width:20; } " +
      "[cnt%3C80]  { marker-width:15; } " +
      "[cnt%3C40]  { marker-width:12; } " +
      "[cnt%3C20]  { marker-width:9;  } " +
      "[cnt%3C10]  { marker-width:6;  } " +
      "[cnt%3C2]   { marker-width:4; marker-line-width:1; }" +
      " } ";

    // Get the first leve (lowest zoom) set of points clustered
    var sql = "SELECT count(*) AS cnt," +
              "ST_Transform(ST_SnapToGrid(the_geom, 0, 0, "+seed+","+seed+"), 3857) AS the_geom_webmercator " +
              "FROM points_na " +
              "GROUP By ST_SnapToGrid(the_geom, 0, 0,"+seed+","+seed+")";

    seed = seed / 2;
    style = baseStyle + "%23points_na { marker-opacity:0.7; marker-line-opacity:0.7; } ";
    statements[0] = "sql=" + sql + "&style=" + style;

    while (z < topZ) { // Create a clustering SQL statement and a style for each zoom < 10

      sql = "SELECT count(*) AS cnt,"+
            "ST_Transform(ST_SnapToGrid(the_geom, 0, 0,"+seed+","+seed+"),3857) AS the_geom_webmercator "+
            "FROM points_na " +
            "GROUP BY ST_SnapToGrid(the_geom, 0, 0,"+seed+","+seed+")";

      style = baseStyle + "%23points_na { marker-opacity:0.7; marker-line-opacity:0.7; } ";
      statements[z] = "sql=" + sql + "&style=" + style;
      z++;
      seed = seed / 2;
    }

    z = z - 1;

    // Create a statement for all points and a style for those points at zoom>=10
    sql   = "SELECT 1 as cnt, the_geom_webmercator FROM points_na ";
    style = baseStyle + "%23points_na { marker-opacity:0.9; marker-line-opacity:0.8; } ";
    statements[topZ] = "sql=" + sql + "&style=" + style;

    return statements;
  }
