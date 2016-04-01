Ext.namespace('Portal.details');

Portal.details.GeomDisplayPanel = Ext.extend(Ext.Panel, {

    TABLE_HEIGHT: 25,

    setGeometry: function(geometry) {
        // Defer this incase this is not rendered yet.
        var self = this;
        setTimeout(function() {
            self.setBounds(geometry.getBounds());
        }, 0);
    },

    _buildLabel: function(i18nKey) {
        return new Ext.form.Label({
            text: OpenLayers.i18n(i18nKey),
            width: 15
        });
    },

    _hasErrors: function() {
        throw ("Should be implemented by subclasses");
    },

    _setGeometryFromUserEnteredVals: function() {

        if (this.map) {
            var newBoundsAsGeometry = this.getBounds().toGeometry();
            if (newBoundsAsGeometry.getArea() >= 0) {
                this.map.events.triggerEvent('spatialconstraintusermodded', newBoundsAsGeometry);
                trackFiltersUsage('filtersTrackingSpatialConstraintAction', OpenLayers.i18n('trackingTypedBboxLabel'));
            }
        }
    },

    _buildCoord: function(name, min, max) {
        return new Ext.form.NumberField({
            name: name,
            decimalPrecision: 2,
            width: 55,
            overCls: "hightlightInputbox",
            emptyText: OpenLayers.i18n('emptySpatialBL'),
            minValue : min,
            maxValue : max,
            listeners: {
                scope: this,
                change: function() {
                    if (this._hasErrors()) {
                        this._setGeometryFromUserEnteredVals();
                    }
                }
            }
        });
    }
});
