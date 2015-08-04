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

        if (this.map.spatialConstraintControl) {
            this._updateWithGeometry(this.map.spatialConstraintControl.getConstraint());
            this.filter.map = this.map;
        }
    },

    _createControls: function() {
        // No controls to create (handled by the global spatial filter)
    },

    handleRemoveFilter: function() {
        // Nothing to do on clear (handled by the global spatial filter)
    },

    needsFilterRange: function() {
        return false;
    },

    _updateWithGeometry: function(geometry) {

        this.filter.setValue(geometry);
    }
});
