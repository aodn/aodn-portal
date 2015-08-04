

Ext.namespace('Portal.utils.geo');

Portal.utils.geo.bboxAsStringToBounds = function(bboxAsString) {

    var bbox = bboxAsString.split(",");

    var minx = parseFloat(bbox[0]); // W
    var miny = parseFloat(bbox[1]); // S
    var maxx = parseFloat(bbox[2]); // E
    var maxy = parseFloat(bbox[3]); // N

    return new OpenLayers.Bounds(minx, miny, maxx, maxy);
};

Portal.utils.geo.bboxAsStringToGeometry = function(bboxAsString) {
    return Portal.utils.geo.bboxAsStringToBounds(bboxAsString).toGeometry();
};
