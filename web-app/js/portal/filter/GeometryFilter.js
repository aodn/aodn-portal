Ext.namespace('Portal.filter');

Portal.filter.GeometryFilter = Ext.extend(Portal.filter.Filter, {

    getSupportedGeoserverTypes: function() {

        return ['pointpropertytype', 'geometrypropertytype', 'multilinepropertytype', 'surfacepropertytype', 'curvepropertytype'];
    },

    getUiComponentClass: function() {

        return Portal.filter.ui.GeometryFilterService;
    },

    getCql: function() {

        return String.format(
            "INTERSECTS({0},{1})",
            this.getName(),
            this.getValue().toWkt()
        );
    },

    getWkt: function() {
        return this.getValue().toWkt();
    },

    getHumanReadableForm: function() {

        var label = OpenLayers.i18n("spatialExtentHeading");
        var note = this._isRealPolygon() ? OpenLayers.i18n("spatialExtentPolygonNote") : "";
        var prettyBounds = this.getValue().getPrettyBounds();

        return String.format(
            '{0}: {1}{2}',
            label,
            note,
            prettyBounds
        );
    },

    _isRealPolygon: function() {

        return this.map.getSpatialConstraintType() == "polygon";
    }
});
