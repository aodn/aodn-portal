/*
 * Copyright 2015 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.filter');

Portal.filter.GeometryFilter = Ext.extend(Portal.filter.Filter, {

    getSupportedGeoserverTypes: function() {

        return ['pointpropertytype', 'geometrypropertytype', 'multilinepropertytype', 'surfacepropertytype', 'curvepropertytype'];
    },

    getUiComponentClass: function() {

        return Portal.filter.ui.GeometryFilterPanel;
    },

    getCql: function() {

        return String.format(
            "INTERSECTS({0},{1})",
            this.getName(),
            this.getValue().toWkt()
        );
    },

    getHumanReadableForm: function() {

        var label = OpenLayers.i18n("spatialExtentHeading");
        var note = this._isRealPolygon() ? OpenLayers.i18n("spatialExtentPolygonNote") : "";

        return String.format(
            '{0}: {1}{2}',
            label,
            note,
            this.getValue().getBounds()
        );
    },

    _isRealPolygon: function() {

        return this.map.getSpatialConstraintType() == "polygon";
    }
});
