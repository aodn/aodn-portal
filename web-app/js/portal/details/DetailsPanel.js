/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.details');

Portal.details.DetailsPanel = Ext.extend(Ext.Panel, {

    constructor : function(cfg) {

        this.dataCollectionSelectorPanel = new Portal.details.DataCollectionSelectorPanel();
        this.layerDetailsPanel = new Ext.Panel({
            layout: 'card',
            flex: 1
        });

        var config = Ext.apply({
            title: OpenLayers.i18n('stepHeader', { stepNumber: 2, stepDescription: OpenLayers.i18n('step2Description')}),
            headerCfg: {
                cls : 'steps'
            },
            items: [
                this.dataCollectionSelectorPanel,
                this.layerDetailsPanel
            ],
            layout: 'vbox',
            layoutConfig: {
                align: 'stretch'
            }
        }, cfg);

        Portal.details.DetailsPanel.superclass.constructor.call(this, config);

        Ext.MsgBus.subscribe(PORTAL_EVENTS.SELECTED_LAYER_CHANGED, function(eventName, openlayer) {
            this.updateDetailsPanel(openlayer);
        }, this);

        Ext.MsgBus.subscribe(PORTAL_EVENTS.LAYER_REMOVED, function(eventName, openlayer) {
            this._removeCardForLayer(openlayer);
        }, this);

        // TODO: why?  I think this might be unecessary now that the tab panel is not shared.
        this.hideDetailsPanelContents();
    },

    updateDetailsPanel: function(layer, forceOpen) {
        if (layer) {
            if (!this._cardExistsForLayer(layer)) {
                this._addCardForLayer(layer);
            }

            this._activateCardForLayer(layer);
            this.showDetailsPanelContents;
        }
        else {
            this.hideDetailsPanelContents();
        }
    },

    hideDetailsPanelContents: function() {
        // clear the details Panel. ie. Don't show any layer options

        //DO NOT HIDE THE opacitySlider directly, or you WILL break things.-Alex
        this.layerDetailsPanel.setVisible(false);
    },

    showDetailsPanelContents: function() {
        this.layerDetailsPanel.setVisible(true);
    },

    _cardExistsForLayer: function(layer) {
        return this.layerDetailsPanel.items.item(this._getCardIdForLayer(layer));
    },

    _addCardForLayer: function(layer) {
        var cardForLayer = new Portal.details.DetailsPanelTab({
            id: this._getCardIdForLayer(layer),
            map: this.map
        });
        this.layerDetailsPanel.add(cardForLayer);
        this.layerDetailsPanel.doLayout(false, true);

        cardForLayer.handleLayer(layer);
    },

    _activateCardForLayer: function(layer) {
        this.layerDetailsPanel.layout.setActiveItem(this._getCardIdForLayer(layer));
    },

    _removeCardForLayer: function(layer) {
        if (this._cardExistsForLayer(layer)) {
            this.layerDetailsPanel.remove(this._getCardIdForLayer(layer));
        }
    },

    _getCardIdForLayer: function(layer) {
        return layer.id + '_detailsPanel';
    }
});
