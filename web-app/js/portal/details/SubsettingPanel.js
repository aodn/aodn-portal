/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.details');

Portal.details.SubsettingPanel = Ext.extend(Ext.Panel, {

    constructor : function(cfg) {

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
            if (!this._itemExistsForLayer(layer)) {
                this._addItemForLayer(layer);
            }
            this._activateItemForLayer(layer);
        }
    },

    _itemExistsForLayer: function(layer) {
        return (this.subsetPanelAccordion.items.item(this._getItemIdForLayer(layer)) != undefined);
    },

    _addItemForLayer: function(layer) {

        var layerContainer = new Portal.details.SubsetItemsWrapperPanel({
            map: this.map,
            layer: layer,
            layerItemId: this._getItemIdForLayer(layer),
            listeners: {
                expand: this._fireSelectedLayerChangedEvent(layer),
                scope: this
            }
        });

        this.subsetPanelAccordion.add(layerContainer);
        this.subsetPanelAccordion.doLayout();
        this.emptyTextPanel.hide();
    },

    _fireSelectedLayerChangedEvent: function(layer) {
        return function() {
            Ext.MsgBus.publish(PORTAL_EVENTS.SELECTED_LAYER_CHANGED, layer);
        }
    },

    _activateItemForLayer: function(layer) {

        if (this._itemExistsForLayer(layer)) {
            this.subsetPanelAccordion.layout.setActiveItem(this._getItemIdForLayer(layer));
            this.subsetPanelAccordion.items.item(this._getItemIdForLayer(layer)).expand();
        }
    },

    _removeFolderForLayer: function(layer) {
        if (this._itemExistsForLayer(layer)) {
            this.subsetPanelAccordion.remove(this._getItemIdForLayer(layer));
        }
        this.checkState();
    },

    checkState: function() {
        if (this.subsetPanelAccordion.items.length == 0) {
            this.emptyTextPanel.show();
        }
    },

    _getItemIdForLayer: function(layer) {
        return layer.id + '_subsettingPanel';
    }
});
