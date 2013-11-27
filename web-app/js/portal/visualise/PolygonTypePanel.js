/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.visualise');

Portal.visualise.PolygonTypePanel = Ext.extend(Ext.Panel, {

    constructor: function(cfg) {
        this.polygonTypeCombo = new Portal.form.PolygonTypeComboBox();

        var config = Ext.apply({
            items: [
                {
                    html: String.format("<b>{0}</b>", OpenLayers.i18n('polygonTypePanelHeader'))
                },
                new Ext.Spacer({ height: 7 }),
                this.polygonTypeCombo
            ]
        }, cfg);

        Portal.visualise.PolygonTypePanel.superclass.constructor.call(this, config);
    },

    // Expose the underlying combo box for messages to other entities
    getValue: function() {
        return this.polygonTypeCombo.getValue();
    },

    setValue: function(value) {
        this.polygonTypeCombo.setValue(value);
    }
});
