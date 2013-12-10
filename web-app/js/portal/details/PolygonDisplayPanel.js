/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
Ext.namespace('Portal.details');

Portal.details.PolygonDisplayPanel = Ext.extend(Ext.grid.GridPanel, {

    constructor: function(cfg) {

        this.verticesStore = new Ext.data.JsonStore({
            fields: [
                'y',
                'x'
            ]
        });

        var config = Ext.apply({
            disableSelection: true,
            hideHeaders: true,
            store: this.verticesStore,
            colModel: new Ext.grid.ColumnModel({
                columns: [
                    'y',
                    'x'
                ]
            }),
            viewConfig: {
                autoFill: true,
                headersDisabled: true
            }
        }, cfg);

        Portal.details.PolygonDisplayPanel.superclass.constructor.call(this, config);
    },

    setGeometry: function(geometry) {
        this.verticesStore.loadData(geometry.getVertices());
    }
});
