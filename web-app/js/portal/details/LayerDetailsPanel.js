/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.details');

Portal.details.LayerDetailsPanel = Ext.extend(Ext.Container, {

    constructor: function(cfg) {
        this.layer = cfg.layer;

        var config = Ext.apply({
            title: OpenLayers.i18n('layerDetailsPanelTitle')
        }, cfg);

        Portal.details.LayerDetailsPanel.superclass.constructor.call(this, config);
    },

    initComponent: function() {
        this.items = [
            this._makeSpacer(),
            new Portal.details.LayerControlPanel({
                dataCollection: this.dataCollection,
                layer: this.layer,
                map: this.map
            }),
            this._makeSpacer(),
            new Portal.details.StylePanel({
                layer: this.layer
            })
        ];

        Portal.details.LayerDetailsPanel.superclass.initComponent.call(this);
    },

    _makeSpacer: function() {
        return new Ext.Spacer({
            height: 10
        });
    }
});
