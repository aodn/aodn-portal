/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.details');

Portal.details.SpatialSubsetControlsPanel = Ext.extend(Ext.Panel, {

    constructor: function(cfg) {

        var config = Ext.apply({
            cls: "spatialSubsetControl"
        }, cfg);

        Portal.details.SpatialSubsetControlsPanel.superclass.constructor.call(this, config);

        this._addPickerPanel();
        this._addSpatialConstraintDisplayPanel();
    },

    _addPickerPanel: function() {

        this.polygonTypeCombo = new Portal.form.PolygonTypeComboBox({
            width: 125,
            map: this.map
        });

        var resetLink = new Ext.ux.Hyperlink({
            text: OpenLayers.i18n('resetActionText'),
            anchorCls: 'resetText'
        });

        resetLink.on('click', function() {
            this.map.events.triggerEvent('spatialconstraintcleared');
            trackFiltersUsage('filtersTrackingSpatialConstraintAction', OpenLayers.i18n('trackingValueCleared'));
        }, this);

        var pickerPanel = new Ext.Panel({
            width: 135,
            cls: "floatLeft",
            items: [
                this._addLabel(OpenLayers.i18n('spatialExtentHeading')),
                this._addVerticalSpacer(10),
                this.polygonTypeCombo,
                this._addVerticalSpacer(5),
                resetLink
            ]
        });

        this.add(pickerPanel);
    },

    _addSpatialConstraintDisplayPanel: function() {
        this.spatialConstraintDisplayPanel = new Portal.details.SpatialConstraintDisplayPanel({
            map: this.map,
            cls: "floatLeft",
            unstyled: true,
            width: 160
        });
        this.add(this.spatialConstraintDisplayPanel);
    },

    _addVerticalSpacer: function(height) {
        return new Ext.Spacer({ height: height });
    },

    _addLabel: function(labelText) {

        if (!this.hideLabel) {
            var label = new Ext.form.Label({
                html: "<h3>" + labelText + "</h3>"
            });
            return label;
        }
    },

    handleRemoveFilter: function() {

        if (this.map.spatialConstraintControl) {
            this.map.spatialConstraintControl.clear();
        }

        this.map.events.triggerEvent('spatialconstraintcleared');
        trackFiltersUsage('filtersTrackingSpatialConstraintAction', OpenLayers.i18n('trackingValueCleared'));
    }
});
