Ext.namespace('Portal.details');

Portal.details.GlobalGeometryFilterPanel = Ext.extend(Ext.Panel, {

    constructor: function(cfg) {

        var config = Ext.apply({
            cls: "spatialSubsetControl"
        }, cfg);

        Portal.details.GlobalGeometryFilterPanel.superclass.constructor.call(this, config);

        Ext.MsgBus.subscribe(PORTAL_EVENTS.RESET, function() {
            this._callSpatialConstraintCleared();
        }, this);

        this._addPickerPanel();
        this._addSpatialConstraintDisplayPanel();
    },

    _addPickerPanel: function() {

        this.polygonTypeCombo = new Portal.form.PolygonTypeComboBox({
            width: 125,
            map: this.map
        });

        var resetLink = new Ext.ux.Hyperlink({
            text: OpenLayers.i18n('clearLinkLabel', {text: OpenLayers.i18n('resetLabel')}),
            cls: 'small',
            anchorCls: 'resetText'
        });

        resetLink.on('click', function() {
            this._callSpatialConstraintCleared();
            trackFiltersUsage('filtersTrackingSpatialConstraintAction', OpenLayers.i18n('trackingValueCleared'));
        }, this);

        var pickerPanel = new Ext.Panel({
            width: 135,
            cls: "floatLeft",
            items: [
                this._addVerticalSpacer(8),
                this._addLabel(OpenLayers.i18n('spatialExtentHeading')),
                this._addVerticalSpacer(18),
                this.polygonTypeCombo,
                this._addVerticalSpacer(5),
                resetLink
            ]
        });

        this.add(pickerPanel);
    },

    _callSpatialConstraintCleared: function() {
        this.map.events.triggerEvent('spatialconstraintcleared');
    },

    _addSpatialConstraintDisplayPanel: function() {
        this.spatialConstraintDisplayPanel = new Portal.details.SpatialConstraintDisplayPanel({
            map: this.map
        });
        this.add(this.spatialConstraintDisplayPanel);
    },

    _addVerticalSpacer: function(height) {
        return new Ext.Spacer({ height: height });
    },

    _addLabel: function(labelText) {

        return new Ext.form.Label({
            html: "<h3>" + labelText + "</h3>"
        });
    }
});
