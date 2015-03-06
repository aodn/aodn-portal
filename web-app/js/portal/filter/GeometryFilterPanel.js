/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.filter');

Portal.filter.GeometryFilterPanel = Ext.extend(Portal.filter.BaseFilterPanel, {

    constructor: function(cfg) {

        var config = Ext.apply({
            typeLabel: OpenLayers.i18n('spatialExtentHeading')
        }, cfg);

        Portal.filter.GeometryFilterPanel.superclass.constructor.call(this, config);

        this.map = cfg.layer.map;
        this.map.events.on({
            scope: this,
            'spatialconstraintadded': function(geometry) {
                this._updateWithGeometry(geometry);
            },
            'spatialconstraintcleared': function() {
                this._updateWithGeometry();
            }
        });
    },

    _createField: function() {
        this.spatialSubsetControlsPanel = new Portal.details.SpatialSubsetControlsPanel({
            map: this.layer.map,
            hideLabel: true
        });
        this.add(this.spatialSubsetControlsPanel);
    },

    isVisualised: function() {
        return false;
    },

    handleRemoveFilter: function() {

        if (this.map.spatialConstraintControl) {
            this.map.spatialConstraintControl.clear();
        }

        this.map.events.triggerEvent('spatialconstraintcleared');
        trackFiltersUsage('filtersTrackingSpatialConstraintAction', OpenLayers.i18n('trackingValueCleared'));
    },

    hasValue: function() {
        return this.geometry != undefined;
    },

    getFilterName: function() {
        return undefined;
    },

    setLayerAndFilter: function(layer, filter) {
        Portal.filter.GeometryFilterPanel.superclass.setLayerAndFilter.apply(this, arguments);
        if (layer.map.spatialConstraintControl) {
            this._updateWithGeometry(layer.map.spatialConstraintControl.getConstraint());
        }
    },

    _updateWithGeometry: function(geometry) {
        this.geometry = geometry;
        this._fireAddEvent();
    },

    _setExistingFilters: function() {
        // Never restored from an existing filter
    },

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
    },

    needsFilterRange: function() {
        return false;
    },

    getFilterData: function() {

        return {
            name: this.filter.getName(),
            visualised: this.isVisualised(),
            cql: this.getCQL(),
            humanValue: this._getCQLHumanValue(),
            type: "geom"
        }
    }
});
