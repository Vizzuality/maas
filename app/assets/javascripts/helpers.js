function createCalls(seed, bottomZ) {
  var
  z     = bottomZ,
  topZ  = bottomZ + 6,
  statements = {},
  tableName = "github_javascript";

  // Define our base grid style
  var baseStyle = "%23" + tableName + " { polygon-fill:%23EFF3FF; polygon-opacity:0.6; line-opacity:1; line-color:%23FFFFFF; ";

    // Add grid colors based on count (prop_count) in clusters
    baseStyle += "[prop_count%3E160] { polygon-fill:%2308519C; polygon-opacity:0.7;  } " +
      "[prop_count%3C160] { polygon-fill:%233182BD; polygon-opacity:0.65; } " +
      "[prop_count%3C80]  { polygon-fill:%236BAED6; polygon-opacity:0.6;  } " +
      "[prop_count%3C40]  { polygon-fill:%239ECAE1; polygon-opacity:0.6;  } " +
      "[prop_count%3C20]  { polygon-fill:%23C6DBEF; polygon-opacity:0.6;  } " +
      "[prop_count%3C2]   { polygon-fill:%23EFF3FF; polygon-opacity:0.4;  }} ";

    // Get the first level (lowest zoom) set of points clustered
    var
    sql   = "SELECT prop_count, ST_Transform(ST_Envelope(GEOMETRYFROMTEXT('LINESTRING('||(st_xmax(the_geom)-"+(seed/2)+")||' '||(st_ymax(the_geom)-"+(seed/2)+")||', '||(st_xmax(the_geom)%2B"+(seed/2)+")||' '||(st_ymax(the_geom)%2B"+(seed/2)+")||')',4326)),3857) as the_geom_webmercator FROM (SELECT count(*) as prop_count, ST_SnapToGrid(the_geom, 0%2B"+(seed/2)+", 75%2B"+(seed/2)+", "+seed+", "+seed+") as the_geom FROM " + tableName + " GROUP By ST_SnapToGrid(the_geom, 0%2B"+(seed/2)+", 75%2B"+(seed/2)+", "+seed+", "+seed+")) " + tableName + " WHERE ST_Intersects(the_geom, GEOMETRYFROMTEXT('MULTIPOLYGON(((-180 75, -180 -75, 180 -75, 180 75, -180 75)))',4326))";
    seed  = seed/2;
    style = baseStyle;

    statements[0] = "sql=" + sql + "&style=" + style;

    // Create a clustering SQL statement and a style for each zoom < topZ
    while (z < topZ) {
      sql = "SELECT prop_count, ST_Transform(ST_Envelope(GEOMETRYFROMTEXT('LINESTRING('||(st_xmax(the_geom)-"+(seed/2)+")||' '||(st_ymax(the_geom)-"+(seed/2)+")||', '||(st_xmax(the_geom)%2B"+(seed/2)+")||' '||(st_ymax(the_geom)%2B"+(seed/2)+")||')',4326)),3857) as the_geom_webmercator FROM (SELECT count(*) as prop_count, ST_SnapToGrid(the_geom, 0%2B"+(seed/2)+", 75%2B"+(seed/2)+", "+seed+", "+seed+") as the_geom FROM " + tableName + " GROUP By ST_SnapToGrid(the_geom, 0%2B"+(seed/2)+", 75%2B"+(seed/2)+", "+seed+", "+seed+")) " + tableName + " WHERE ST_Intersects(the_geom, GEOMETRYFROMTEXT('MULTIPOLYGON(((-180 75, -180 -75, 180 -75, 180 75, -180 75)))',4326))";
      statements[z] = "sql=" + sql + "&style=" + style;
      z++;
      seed = seed/2;
    }

    z = z-1;

    // Create a statement for all points and a style for those points at zoom >= 10
    sql   = "SELECT 1 as prop_count, the_geom_webmercator FROM " + tableName;
    style = "%23" + tableName + " { " +
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

function intcomma( number, decimals ) {
	decimals = decimals === undefined ? 0 : decimals;
	return number_format( number, decimals, '.', ',' );
};

function intword(number) {
  number = parseInt( number );
  if( number < 1000000 ) {
    return number;
  } else if( number < 100 ) {
    return intcomma(number, 1 );
  } else if( number < 1000 ) {
    return intcomma( number / 100, 1 ) + " hundred";
  } else if( number < 100000 ) {
    return intcomma( number / 1000.0, 1 ) + "K";
  } else if( number < 1000000 ) {
    return intcomma( number / 100000.0, 1 ) + " hundred K";
  } else if( number < 1000000000 ) {
    return intcomma( number / 1000000.0, 1 ) + "M";
  } else if( number < 1000000000000 ) { //senseless on a 32 bit system probably.
    return intcomma( number / 1000000000.0, 1 ) + " billion";
  } else if( number < 1000000000000000 ) {
    return intcomma( number / 1000000000000.0, 1 ) + " trillion";
  }
  return "" + number;	// too big.
}

function number_format( number, decimals, dec_point, thousands_sep ) {
	// http://kevin.vanzonneveld.net
	// +   original by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
	// +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// +	 bugfix by: Michael White (http://crestidg.com)
	// +	 bugfix by: Benjamin Lupton
	// +	 bugfix by: Allan Jensen (http://www.winternet.no)
	// +	revised by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
	// *	 example 1: number_format(1234.5678, 2, '.', '');
	// *	 returns 1: 1234.57

	var n = number, c = isNaN(decimals = Math.abs(decimals)) ? 2 : decimals;
	var d = dec_point == undefined ? "," : dec_point;
	var t = thousands_sep == undefined ? "." : thousands_sep, s = n < 0 ? "-" : "";
	var i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", j = (j = i.length) > 3 ? j % 3 : 0;

	return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
}
