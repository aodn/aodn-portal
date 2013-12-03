/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
Ext.namespace('Portal.details');

Portal.details.PolygonDisplayPanel = Ext.extend(Ext.Panel, {

    constructor: function(cfg) {

        this.label = new Ext.form.Label();

        var config = Ext.apply({
            layout: 'fit',
            items: [
                this.label
            ]
        }, cfg);

        Portal.details.PolygonDisplayPanel.superclass.constructor.call(this, config);
    },

    setGeometry: function(geometry) {
        this.label.setText(Portal.utils.geo.geometryToWkt(geometry));
    }
});
