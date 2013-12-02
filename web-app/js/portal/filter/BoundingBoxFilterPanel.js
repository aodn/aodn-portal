/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.filter');

Portal.filter.BoundingBoxFilterPanel = Ext.extend(Portal.filter.BaseFilterPanel, {

    constructor: function(cfg) {
        var config = Ext.apply({
            colspan: 2
        }, cfg);

        Portal.filter.BoundingBoxFilterPanel.superclass.constructor.call(this, config);
    },

    _createField: function() {
        this.bbox = new Portal.details.BoundingBoxPanel({
            map: this.layer.map
        });
        this.add(this.bbox);
    },

    isDownloadOnly: function() {
        return true;
    },

    handleRemoveFilter: function() {
        // Can't be removed
    },

    getFilterName: function() {
        return undefined;
    },

    setLayerAndFilter: function(layer, filter) {
        Portal.filter.BoundingBoxFilterPanel.superclass.setLayerAndFilter.apply(this, arguments);

        this._updateBounds(layer.map.spatialConstraintControl.getConstraint());
    },

    _setExistingFilters: function() {
        // Never restored from an existing filter
    },

    _updateBounds: function(geometry) {
        this.bbox.setBounds(geometry.getBounds());
        this._fireAddEvent();
    },

    getCQL: function() {
        return String.format(
            "BBOX({0},{1},{2},{3},{4})",
            this.filter.name,
            this.bbox.getWestBL(),
            this.bbox.getSouthBL(),
            this.bbox.getEastBL(),
            this.bbox.getNorthBL()
        );
    }
});
