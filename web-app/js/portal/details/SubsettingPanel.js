/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.details');

Portal.details.SubsettingPanel = Ext.extend(Ext.Panel, {

    constructor : function(cfg) {

        this.map = cfg.map;
        this.mapPanel = cfg.mapPanel;

        this.spatialSubsetControlsPanel = new Portal.details.SpatialSubsetControlsPanel({
            map: cfg.map,
            hideLabel: false
        });

        this.subsetPanelAccordion = new Portal.details.SubsetPanelAccordion();

        this.emptyTextPanel =  new Portal.common.EmptyCollectionStatusPanel({
            hidden: true
        });

        var config = Ext.apply({
            autoScroll: true,
            title: OpenLayers.i18n('stepHeader', { stepNumber: 2, stepDescription: OpenLayers.i18n('step2Description')}),
            headerCfg: {
                cls : 'steps'
            },

            items: [
                new Ext.Spacer({height: 5}),
                this.spatialSubsetControlsPanel,
                this.subsetPanelAccordion,
                new Ext.Spacer({height: 20}),
                this.emptyTextPanel
            ]
        }, cfg);

        Portal.details.SubsettingPanel.superclass.constructor.call(this, config);

        Ext.MsgBus.subscribe(PORTAL_EVENTS.SELECTED_LAYER_CHANGED, function(eventName, openlayer) {
            this.updateSubsetPanelAccordionItem(openlayer);
        }, this);

        Ext.MsgBus.subscribe(PORTAL_EVENTS.LAYER_REMOVED, function(eventName, openlayer) {
            this._removeFolderForLayer(openlayer);
        }, this);
    },

    updateSubsetPanelAccordionItem: function(layer) {
        if (layer) {
            if (!this._folderExistsForLayer(layer) || this._folderExistsForLayer(layer) == undefined) {
                this._addFolderForLayer(layer);
            }
            this._activateFolderForLayer(layer);
        }
    },

    _folderExistsForLayer: function(layer) {
        return this.subsetPanelAccordion.items.item(this._getFolderIdForLayer(layer));
    },

    _addFolderForLayer: function(layer) {

        var folderForLayer = new Portal.details.SubsetItemsTabPanel( {
            map: this.map,
            layer: layer
        });

        // tabpanel wont sit in an accordion layout
        var folderForLayerContainer = new Ext.Panel({
            id: this._getFolderIdForLayer(layer),
            title: '<h4>' + layer.name + '</h4>',
            autoHeight: true,
            defaults: {
                style: {padding:'10px'},
                autoHeight: true
            },
            items: [folderForLayer],
            tools: [{
                id: 'delete',
                handler: this._layerDelete,
                scope: this,
                title: OpenLayers.i18n('removeDataCollection')
            }]
        });

        this.subsetPanelAccordion.add(folderForLayerContainer);
        this.emptyTextPanel.hide();
    },

    _layerDelete: function(event, toolEl, panel) {

        var collectionId = panel.items.items[0].layer.parentGeoNetworkRecord.data.uuid;
        var record = Portal.data.ActiveGeoNetworkRecordStore.instance().getRecordFromUuid(collectionId);
        Portal.data.ActiveGeoNetworkRecordStore.instance().remove(record);
    },

    _activateFolderForLayer: function(layer) {
        this.subsetPanelAccordion.layout.setActiveItem(this._getFolderIdForLayer(layer));
        this.subsetPanelAccordion.doLayout();
    },

    _removeFolderForLayer: function(layer) {
        if (this._folderExistsForLayer(layer)) {
            this.subsetPanelAccordion.remove(this._getFolderIdForLayer(layer));
        }
        this.checkState();
    },

    checkState: function() {
        if (this.subsetPanelAccordion.items.length == 0) {
            this.emptyTextPanel.show();
        }
    },

    _getFolderIdForLayer: function(layer) {
        return layer.id + '_subsettingPanel';
    }
});
