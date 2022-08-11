Ext.namespace('Portal.filter.combiner');

Portal.filter.combiner.SpatialSubsetIntersectTester = Ext.extend(Object, {

    constructor: function(cfg) {
        Portal.filter.combiner.SpatialSubsetIntersectTester.superclass.constructor.call(this, cfg);
    },

    testSpatialSubsetIntersect: function(dataCollection) {

        var intersect;
        var filters = dataCollection.getFilters();

        if (filters) {
            intersect = this._checkPointIntersectsBounds(filters);
            if (intersect == undefined) {
                intersect = this._checkGeometryIntersectsBounds(dataCollection, filters);
            }
        }
        return intersect;
    },

    _checkGeometryIntersectsBounds: function(dataCollection, filters) {
        var extent;
        var params = filters.filter(function(filter) {
            if (filter.isNcwmsParams || filter.type === 'geometrypropertytype') {
                return true;
            }
        })[0];

        if (params && params.isNcwmsParams && params.latitudeRangeStart != undefined) {
            extent = new OpenLayers.Bounds(params.longitudeRangeStart, params.latitudeRangeStart, params.longitudeRangeEnd, params.latitudeRangeEnd);
        }
        else if (params && params.value != undefined && params.value.bounds != undefined ) {
            extent = new OpenLayers.Bounds(params.value.bounds.left, params.value.bounds.bottom, params.value.bounds.right, params.value.bounds.top);
        }

        var bounds = dataCollection.getBounds();
        if (extent && bounds) {
            return bounds.intersectsBounds(extent, true, true);
        }
        return true;
    },

    _checkPointIntersectsBounds: function(filters) {
        var params = filters.filter(function(filter) {
            if (filter.name === 'timeSeriesAtPoint') {
                return true;
            }
        })[0];

        if (params && params.value != undefined && params.value.errors != undefined) {
            return (params.value.errors.length == 0);
        }
        else {
            return undefined;
        }
    }
});