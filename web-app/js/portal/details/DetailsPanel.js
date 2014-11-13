/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.details');

Portal.details.DetailsPanel = Ext.extend(Ext.Panel, {

    constructor : function(cfg) {

        this.spacer = new Ext.Spacer({height: 10});
        this.dataCollectionSelectorPanel = new Portal.details.DataCollectionSelectorPanel({
            layout: 'card',
            activeItem: 0
        });
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
                this.spacer,
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
    },

    updateDetailsPanel: function(layer) {
        if (layer) {
            if (!this._cardExistsForLayer(layer)) {
                this._addCardForLayer(layer);
            }
            this._activateCardForLayer(layer);
            this.layerDetailsPanel.show();
        }
        else {
            this.layerDetailsPanel.hide();
        }
    },

    _cardExistsForLayer: function(layer) {
        return this.layerDetailsPanel.items.item(this._getCardIdForLayer(layer));
    },

    _addCardForLayer: function(layer) {
        var cardForLayer = new Portal.details.DetailsPanelTab({
            id: this._getCardIdForLayer(layer),
            map: this.map,
            mapPanel: this.mapPanel,
            layer: layer
        });
        this.layerDetailsPanel.add(cardForLayer);
    },

    layoutCard: function() {
        this.doLayout();
    },

    _activateCardForLayer: function(layer) {
        this.layerDetailsPanel.layout.setActiveItem(this._getCardIdForLayer(layer));
        this.layoutCard();
    },

    _removeCardForLayer: function(layer) {
        if (this._cardExistsForLayer(layer)) {
            // todo throws errors
            //this.layerDetailsPanel.remove(this._getCardIdForLayer(layer));
        }
    },

    _getCardIdForLayer: function(layer) {
        return layer.id + '_detailsPanel';
    }
});
