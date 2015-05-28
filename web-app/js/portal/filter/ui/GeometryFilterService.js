/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.filter.ui');

Portal.filter.ui.GeometryFilterService = Ext.extend(Portal.filter.ui.BaseFilterPanel, {

    constructor: function(cfg) {

        var config = Ext.apply({
            typeLabel: undefined
        }, cfg);

        this.map = cfg.map;
        this.map.events.on({
            scope: this,
            'spatialconstraintadded': function(geometry) {
                this._updateWithGeometry(geometry);
            },
            'spatialconstraintcleared': function() {
                this._updateWithGeometry();
            }
        });
        Portal.filter.ui.GeometryFilterService.superclass.constructor.call(this, config);

    },

    setLayerAndFilter: function(layer, filter) {
        Portal.filter.ui.GeometryFilterService.superclass.setLayerAndFilter.apply(this, arguments);

        if (this.map.spatialConstraintControl) {
            this._updateWithGeometry(this.map.spatialConstraintControl.getConstraint());
            filter.map = this.map;
        }
    },

    _createControls: function() {
        // Not a physical panel, Using a global Geometry filter
    },

    handleRemoveFilter: function() {

        if (this.map.spatialConstraintControl) {
            this.map.spatialConstraintControl.clear();
        }
        this.map.events.triggerEvent('spatialconstraintcleared');

        this.filter.clearValue();

        trackFiltersUsage('filtersTrackingSpatialConstraintAction', OpenLayers.i18n('trackingValueCleared'));
    },

    needsFilterRange: function() {
        return false;
    },

    _updateWithGeometry: function(geometry) {

        this.filter.setValue(geometry);

        this._fireAddEvent();
    }
});
