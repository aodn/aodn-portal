Ext.namespace('Portal.details');

Portal.details.GeomDisplayPanel = Ext.extend(Ext.Panel, {


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

    hasNumberFieldErrors: function() {

        var errors = [].concat(
            this.lon.getErrors(),
            this.lat.getErrors()
        );
        return (errors.length == 0);
    },

    setGeometryFromUserEnteredVals: function() {

        if (this.map) {
            var newBoundsAsGeometry = this.getBounds().toGeometry();
            if (newBoundsAsGeometry.getArea() >= 0) {
                this.map.events.triggerEvent('spatialconstraintusermodded', newBoundsAsGeometry);
                trackFiltersUsage('filtersTrackingSpatialConstraintAction', OpenLayers.i18n('trackingTypedBboxLabel'));
            }
        }
    }
});
