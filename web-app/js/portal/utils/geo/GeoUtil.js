/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.utils.geo');

Portal.utils.geo.bboxAsStringToBounds = function(bboxAsString) {

    var bbox = bboxAsString.split(",");

    var minx = parseFloat(bbox[0]);
    var maxx = parseFloat(bbox[2]);
    var miny = parseFloat(bbox[1]);
    var maxy = parseFloat(bbox[3]);

    if (!((minx >= -180 && minx <= 180)
          && (maxx > -180 && maxx <= 180)
          && (miny >= -90 && miny <= 90)
          && (maxy >= -90 && maxy <= 90)
          && minx < maxx
          && miny < maxy)) {
        alert("ERROR: wrong value in bbox ! \n\n" +
              minx +
              ":West = "+(minx >= -180 && minx <= 180)+"\n" +
              miny +
              ":South = "+(miny >= -90 && miny <= 90) +"\n" +
              maxx +
              ":East = "+ (maxx > -180 && maxx <= 180)+"\n" +
              maxy +
              ":North = "+(maxy >= -90 && maxy <= 90) +
              "\n West > East = " + (minx < maxx) +
              "\n South < North = " +(miny < maxy)
             );
        return null;
    }

    return new OpenLayers.Bounds(minx, miny, maxx, maxy);
};

Portal.utils.geo.bboxAsStringToGeometry = function(bboxAsString) {
    return Portal.utils.geo.bboxAsStringToBounds(bboxAsString).toGeometry();
};
