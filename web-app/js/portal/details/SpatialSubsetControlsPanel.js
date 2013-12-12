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
            width: 202,
        }, cfg);

        Portal.details.SpatialSubsetControlsPanel.superclass.constructor.call(this, config);
    },

    initComponent: function() {
        Portal.details.SpatialSubsetControlsPanel.superclass.initComponent.call(this);
        this._addLabel(OpenLayers.i18n('spatialExtentHeading'));
        this._addVerticalSpacer();
        this._addPolygonTypeCombo();
        this._addVerticalSpacer();
        this._addSpatialConstraintDisplayPanel();
    },

    _addPolygonTypeCombo: function() {
        this.polygonTypeCombo = new Portal.form.PolygonTypeComboBox();
        this.add(this.polygonTypeCombo);
    },

    _addSpatialConstraintDisplayPanel: function() {
        this.spatialConstraintDisplayPanel = new Portal.details.SpatialConstraintDisplayPanel({
            map: this.map,
            width: this.width,
        });
        this.add(this.spatialConstraintDisplayPanel);
    },

    _addVerticalSpacer: function() {
        this.add(new Ext.Spacer({ height: 10 }));
    },

    _addLabel: function(labelText) {
        var label = new Ext.form.Label({
            html: "<h4>" + labelText + "</h4>",
        });

        this.add(label);
    }
});
