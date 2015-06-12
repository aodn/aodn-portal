/*
 * Copyright 2015 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.details');

Portal.details.SubsetItemsWrapperPanel = Ext.extend(Ext.Panel, {

    constructor: function (cfg) {

        var tabPanelForLayer = new Portal.details.SubsetItemsTabPanel( {
            map: cfg.map,
            layer: cfg.layer
        });

        this.layer = cfg.layer;

        var config = Ext.apply({
            id: cfg.layerItemId,
            cls: 'subsetPanelAccordionItem',
            title: '<h4>' + cfg.layer.name + '</h4>',
            autoHeight: true,
            defaults: {
                style: {padding:'10px'},
                autoHeight: true
            },
            items: [tabPanelForLayer],
            tools: [
                {
                    id: 'up',
                    qtip: 'move up',
                    scope: this,
                    handler: function(event, toolEl, panel) {
                        this._changeLayerOrder(-1);
                    }
                },
                {
                    id: 'down',
                    qtip: 'move down',
                    scope: this,
                    handler: function(event, toolEl, panel) {
                        this._changeLayerOrder(1);
                    }
                },
                {
                    id: 'delete',
                    handler: this._layerDelete,
                    qtip: OpenLayers.i18n('removeDataCollection'),
                    scope: this
                }
            ]
        }, cfg);

        Portal.details.SubsetItemsWrapperPanel.superclass.constructor.call(this, config);
    },


    _changeLayerOrder: function(direction) {
        var collectionId = this.layer.parentGeoNetworkRecord.data.uuid;
        var record = Portal.data.ActiveGeoNetworkRecordStore.instance().getRecordFromUuid(collectionId);
        Portal.data.ActiveGeoNetworkRecordStore.instance().changeItemOrder(record, direction);
    },

    _layerDelete: function(event, toolEl, panel) {

        var collectionId = this.layer.parentGeoNetworkRecord.data.uuid;
        var record = Portal.data.ActiveGeoNetworkRecordStore.instance().getRecordFromUuid(collectionId);
        Portal.data.ActiveGeoNetworkRecordStore.instance().remove(record);
    }
});
