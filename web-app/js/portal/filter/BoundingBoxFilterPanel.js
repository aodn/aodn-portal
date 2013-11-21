/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.filter');

Portal.filter.BoundingBoxFilterPanel = Ext.extend(Portal.filter.BaseFilterPanel, {

    _createField: function() {
        this.bbox = new Portal.details.BoundingBoxPanel();
        this.add(this.bbox);
    },

    isDownloadOnly: function() {
        return true;
    },

    handleRemoveFilter: function() {
        // Can't be removed
    },

    setLayerAndFilter: function(layer, filter) {
        Portal.filter.BoundingBoxFilterPanel.superclass.setLayerAndFilter.apply(this, arguments);

        this._updateBounds();

        layer.map.events.register("move", this, function(e) {
            this._updateBounds();
        });
    },

    _setExistingFilters: function() {
        // Never restored from an existing filter
    },

    _updateBounds: function() {
        if (this.items.length != 0 && this.layer.map) {
            var extent = this.layer.map.getExtent();
            this.bbox.setBounds(extent);

            this._fireAddEvent();
        }
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
