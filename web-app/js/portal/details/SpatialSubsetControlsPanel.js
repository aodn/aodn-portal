/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.details');

Portal.details.SpatialSubsetControlsPanel = Ext.extend(Ext.Panel, {

    initComponent: function() {
        Portal.details.SpatialSubsetControlsPanel.superclass.initComponent.call(this);
        this._addLabel(OpenLayers.i18n('spatialExtentHeading'));
        this._addPickerPanel();
        this._addVerticalSpacer();
        this._addSpatialConstraintDisplayPanel();
    },

    _addPickerPanel: function() {

        this.polygonTypeCombo = new Portal.form.PolygonTypeComboBox({
            map: this.map
        });

        var resetLink = new Ext.ux.Hyperlink({
            text: OpenLayers.i18n('resetActionText'),
            anchorCls: 'resetText'
        });

        resetLink.on('click', function() {
            this.map.events.triggerEvent('spatialconstraintcleared');
        }, this);

        var spacer = new Ext.Spacer({
            width: 10
        });

        var pickerPanel = new Ext.Panel({
            layout: 'hbox',
            items: [
                this.polygonTypeCombo,
                spacer,
                resetLink
            ]
        });

        this.add(pickerPanel);

    },

    _addSpatialConstraintDisplayPanel: function() {
        this.spatialConstraintDisplayPanel = new Portal.details.SpatialConstraintDisplayPanel({
            map: this.map,
            width: this.width
        });
        this.add(this.spatialConstraintDisplayPanel);
    },

    _addVerticalSpacer: function() {
        this.add(new Ext.Spacer({ height: 5 }));
    },

    _addLabel: function(labelText) {

        if (!this.hideLabel){
            var label = new Ext.form.Label({
                html: "<h4>" + labelText + "</h4>"
            });

            this.add(label);
        }
    }
});
