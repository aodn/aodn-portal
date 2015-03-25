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

    /*
     getCQL: function() {

     if (!this.geometry) {
     return undefined;
     }

     return String.format(
     "INTERSECTS({0},{1})",
     this.filter.getName(),
     this.geometry.toWkt()
     );
     },

     _getCQLHumanValue: function() {
     if (this.geometry) {
     var explanation = (this.isRealPolygon()) ? OpenLayers.i18n("maxExtentOfPolygon") : OpenLayers.i18n("boundingBoxDescription");
     return String.format('{0}:&nbsp;  {1}', explanation, this.geometry.getBounds());
     }
     else {
     return "";
     }
     },

     isRealPolygon: function() {
     return (this.map.getSpatialConstraintType() == "polygon");
     }
     */

    _getCql: function() {

        return String.format(
            "INTERSECTS({0},{1})",
            this.getName(),
            this.getValue().toWkt()
        );
    }
});
