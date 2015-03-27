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

    getHumanReadableForm: function() {

        var explanation = this._isRealPolygon() ? OpenLayers.i18n("maxExtentOfPolygon") : OpenLayers.i18n("boundingBoxDescription");

        return String.format(
            '{0}: {1}',
            explanation,
            this.getValue().getBounds()
        );
    },

    _getCql: function() {

        return String.format(
            "INTERSECTS({0},{1})",
            this.getName(),
            this.getValue().toWkt()
        );
    },

    _isRealPolygon: function() {

        return this.map.getSpatialConstraintType() == "polygon";
    }
});
